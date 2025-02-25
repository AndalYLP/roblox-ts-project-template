/* eslint-disable max-lines -- Decorators can't be moved, or other methods. */
import type { OnInit, OnStart } from "@flamework/core";
import { Modding, Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { MarketplaceService, Players } from "@rbxts/services";
import Sift from "@rbxts/sift";
import Signal from "@rbxts/signal";

import { events } from "server/network";
import type { OnPlayerJoin, PlayerService } from "server/services/player";
import type { PlayerEntity } from "server/services/player/entity";
import { store } from "server/store";
import type { PlayerData } from "shared/store/slices/player";
import { selectPlayerData } from "shared/store/slices/player";
import { selectPlayerMtx } from "shared/store/slices/player/mtx/mtx.selectors";
import type { GamePass, Product } from "types/enum/mtx";
import { gamePass, product } from "types/enum/mtx";
import { noYield } from "utils/no-yield";

const NETWORK_RETRY_ATTEMPTS = 10;
const NETWORK_RETRY_DELAY = 2;

type ProductInfo = DeveloperProductInfo | GamePassProductInfo;

/** @metadata flamework:implements flamework:parameters injectable */
export const MtxEvents = Modding.createMetaDecorator("Class");

/**
 * Register a method to be called when a game pass status changes.
 *
 * The method will be called with the `PlayerEntity`, and whether the game pass
 * is active.
 *
 * @example (method) (playerEntity: PlayerEntity, isActive: boolean): void
 *
 * @param gamePass - The game pass to listen for.
 */
export const GamePassStatusChanged = Modding.createMetaDecorator<[gamePass: GamePass]>("Method");

/**
 * Registers a `method` as a handler for a specific product. The handler will be
 * called when a player purchases the developer product.
 *
 * The handler should return true if the product was successfully processed, or
 * false if there was an error. The handler will also return false if there is
 * an error processing the product.
 *
 * @example (method) (playerEntity: PlayerEntity, product: Product): boolean
 *
 * @param product - The ID of the product to register the handler for.
 * @note Handlers should be registered before the player purchases the
 *  product, and should never yield.
 */
export const RegisterProductHandler = Modding.createMetaDecorator<[product: Product]>("Method");

/**
 * Registers a `method` as a handler for specific developer products. The
 * handler will be invoked when a player purchases one of the registered
 * products.
 *
 * The handler should return `true` if the product was successfully processed,
 * or `false` if there was an error. Attempting to register a handler for a
 * product that already has one will result in an error being logged.
 *
 * @example (method) (playerEntity: PlayerEntity, product: Product, key: string
 *
 * | number): boolean
 *
 * @param products - A record mapping a key to their associated ID.
 * @note Handlers must be registered before the player attempts to purchase a product.
 *       Handlers should not yield or perform any asynchronous operations.
 */
export const RegisterHandlerForEachProduct =
	Modding.createMetaDecorator<[products: Record<number | string, Product>]>("Method");

/**
 * A service for managing game passes and processing receipts.
 *
 * #### Use the decorator instead of connecting to `gamePassStatusChanged` directly.
 *
 * #### Use the decorator instead of calling `RegisterProductHandler` directly.
 *
 * @example
 *
 * ```
 * ⁣@MtxEvents()
 * export class MtxEventsService {
 * 	⁣@gamePassStatusChanged()
 * 	public exampleGamePass(playerEntity: PlayerEntity, isActive: boolean) {
 * 		// Do something when the game pass is activated or deactivated
 * 	}
 *
 * 	⁣@RegisterProductHandler()
 * 	public exampleProduct(playerEntity: PlayerEntity, product: Product): boolean {
 * 		// Do something when the product is purchased
 * 		return true // Return false if there was an error processing the product
 * 	}
 * }
 *
 *
 * for (const pass of gamePasses) {
 *     if (this.mtxService.isGamePassActive(playerEntity, gamePassId)) {
 *         // Do something with the game pass owned
 *         ...
 *     }
 * }
 * ```
 */
@Service()
export class MtxService implements OnInit, OnStart, OnPlayerJoin {
	private readonly gamePassHandlers = new Map<
		GamePass,
		Array<(playerEntity: PlayerEntity, gamePassId: GamePass, isActive: boolean) => void>
	>(Object.values(gamePass).map(gamePassId => [gamePassId, []]));

	private readonly productHandlers = new Map<
		Product,
		{
			args: Array<unknown>;
			handler: (
				playerEntity: PlayerEntity,
				productId: Product,
				...args: Array<unknown>
			) => boolean;
		}
	>();

	private readonly productInfoCache = new Map<number, ProductInfo>();

	private readonly purchaseIdLog = 50;

	/** @ignore */
	public readonly gamePassStatusChanged = new Signal<
		(playerEntity: PlayerEntity, gamePassId: GamePass, isActive: boolean) => void
	>();

	constructor(
		private readonly logger: Logger,
		private readonly playerService: PlayerService,
	) {}

	public registerProductHandler(
		productId: Product,
		handler: (playerEntity: PlayerEntity, productId: Product) => boolean,
		...args: Array<unknown>
	): void {
		if (this.productHandlers.has(productId)) {
			this.logger.Error(`Handler already registered for product ${productId}`);
			return;
		}

		this.logger.Debug(`Registered handler for product ${productId}`);
		this.productHandlers.set(productId, { args, handler });
	}

	private async loadDecorator<T extends "GamePass" | "Product">(
		object: Record<string, Callback>,
		handler: string,
		productType: T,
		productId: T extends "Product" ? Product : GamePass,
	): Promise<void> {
		const withContextHandler = function (...handlerArgs: Array<unknown>): boolean {
			return object[handler](object, ...handlerArgs) as boolean;
		};

		if (productType === "Product") {
			this.registerProductHandler(productId as Product, withContextHandler);
		} else {
			this.gamePassHandlers.get(productId as GamePass)?.push(withContextHandler);
		}
	}

	private async initRegister(): Promise<void> {
		const mtxEvents = Modding.getDecorators<typeof MtxEvents>();

		for (const { constructor, object } of mtxEvents) {
			const singleton = Modding.resolveSingleton(constructor!) as Record<string, Callback>;
			const registerProduct =
				Modding.getPropertyDecorators<typeof RegisterProductHandler>(object);
			const registerForEachProduct =
				Modding.getPropertyDecorators<typeof RegisterHandlerForEachProduct>(object);

			const productDecorators = Sift.Dictionary.merge(
				registerProduct,
				registerForEachProduct,
			);

			for (const [handler, { arguments: args }] of productDecorators) {
				void this.loadDecorator(singleton, handler, "Product", args[0]);
			}

			for (const [handler, { arguments: args }] of Modding.getPropertyDecorators<
				typeof GamePassStatusChanged
			>(object)) {
				void this.loadDecorator(singleton, handler, "GamePass", args[0]);
			}
		}
	}

	/**
	 * Retrieves the product information for a given product or game pass.
	 *
	 * @param infoType - The type of information to retrieve ("Product" or
	 *   "GamePass").
	 * @param productId - The ID of the product or game pass.
	 * @returns A Promise that resolves to the product information, or undefined
	 *   if the information is not available.
	 */
	public async getProductInfo(
		infoType: Enum.InfoType,
		productId: number,
	): Promise<ProductInfo | undefined> {
		if (this.productInfoCache.has(productId)) {
			return this.productInfoCache.get(productId);
		}

		const productInfo = await Promise.retryWithDelay(
			async () => MarketplaceService.GetProductInfo(productId, infoType) as ProductInfo,
			NETWORK_RETRY_ATTEMPTS,
			NETWORK_RETRY_DELAY,
		).catch(() => {
			this.logger.Warn(`Failed to get price for product ${productId}`);
		});

		if (productInfo === undefined) {
			return undefined;
		}

		this.productInfoCache.set(productId, productInfo);

		return productInfo;
	}

	/**
	 * Checks if a game pass is active for a specific player. This method will
	 * return false if the game pass is not owned by the player.
	 *
	 * @param playerEntity - The player entity for whom to check the game pass.
	 * @param playerEntity.player - The player's instance.
	 * @param gamePassId - The ID of the game pass to check.
	 * @returns A boolean indicating whether the game pass is active or not.
	 */
	public isGamePassActive({ player }: PlayerEntity, gamePassId: GamePass): boolean {
		return store.getState(selectPlayerMtx(player))?.gamePasses.get(gamePassId)?.active ?? false;
	}

	private async checkForGamePassOwned(
		{ player }: PlayerEntity,
		gamePassId: GamePass,
	): Promise<boolean> {
		if (!Object.values(gamePass).includes(gamePassId)) {
			throw `Invalid game pass id ${gamePassId}`;
		}

		const owned = store.getState(selectPlayerMtx(player))?.gamePasses.has(gamePassId);
		if (owned === true) {
			return true;
		}

		return MarketplaceService.UserOwnsGamePassAsync(player.UserId, tonumber(gamePassId)!);
	}

	private grantProduct(
		playerEntity: PlayerEntity,
		productId: number,
		currencySpent: number,
	): boolean {
		const { player, UserId } = playerEntity;

		const productIds = tostring(productId) as Product;

		if (!Object.values(product).includes(productIds)) {
			this.logger.Warn(
				`Player ${UserId} attempted to purchased invalid product ${productId}`,
			);
			return false;
		}

		const data = this.productHandlers.get(productIds);
		if (!data) {
			this.logger.Fatal(`No handler for product ${productIds}`);
			return false;
		}

		const [success, result] = pcall(() =>
			noYield(data.handler, playerEntity, productIds, ...data.args),
		);
		if (!success || !result) {
			this.logger.Error(`Failed to process product ${productIds}`);
			return false;
		}

		this.logger.Info(`Player ${UserId} purchased developer product ${productId}`);
		store.purchaseDeveloperProduct(player, productIds, currencySpent);
		return true;
	}

	private async setGamePassActive(
		playerEntity: PlayerEntity,
		gamePassId: GamePass,
		active: boolean,
	): Promise<void> {
		await this.checkForGamePassOwned(playerEntity, gamePassId).then(owned => {
			const { player, UserId } = playerEntity;
			if (!owned) {
				this.logger.Warn(
					`Player ${UserId} tried to activate not game pass ${gamePassId} that they do not own.`,
				);

				return;
			}

			store.setGamePassActive(player, gamePassId, active);
			this.notifyProductActive(playerEntity, gamePassId, active);
		});
	}

	private notifyProductActive(
		playerEntity: PlayerEntity,
		gamePassId: GamePass,
		isActive: boolean,
	): void {
		task.defer(() => {
			const handlers = this.gamePassHandlers.get(gamePassId);
			if (handlers) {
				for (const handler of handlers) {
					task.defer(() => {
						handler(playerEntity, gamePassId, isActive);
					});
				}
			}
		});
		this.gamePassStatusChanged.Fire(playerEntity, gamePassId, isActive);
	}

	private grantGamePass(playerEntity: PlayerEntity, gamePassId: number): void {
		const { player, UserId } = playerEntity;
		const gamePassIds = tostring(gamePassId) as GamePass;

		if (!Object.values(gamePass).includes(gamePassIds)) {
			this.logger.Warn(
				`Player ${UserId} attempted to purchased invalid game pass ${gamePassId}`,
			);
			return;
		}

		this.logger.Info(`Player ${UserId} purchased game pass ${gamePassId}`);
		store.purchaseGamePass(player, gamePassIds);
		this.notifyProductActive(playerEntity, gamePassIds, true);
	}

	private async processReceipt(receiptInfo: ReceiptInfo): Promise<Enum.ProductPurchaseDecision> {
		this.logger.Info(
			`Processing receipt ${receiptInfo.PurchaseId} for ${receiptInfo.PlayerId}`,
		);

		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
		if (!player) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const playerEntity = await this.playerService.getPlayerEntityAsync(player);
		if (!playerEntity) {
			this.logger.Error(`No entity for player ${player.UserId}, cannot process receipt`);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return this.purchaseIdCheck(playerEntity, receiptInfo);
	}

	private async purchaseIdCheck(
		playerEntity: PlayerEntity,
		{ CurrencySpent, ProductId, PurchaseId }: ReceiptInfo,
	): Promise<Enum.ProductPurchaseDecision> {
		const { document, player } = playerEntity;

		if (document.read().mtx.receiptHistory.includes(PurchaseId)) {
			const [success] = document.save().await();
			if (!success) {
				return Enum.ProductPurchaseDecision.NotProcessedYet;
			}

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		}

		const data = store.getState(selectPlayerData(player));
		if (!data) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		if (!this.grantProduct(playerEntity, ProductId, CurrencySpent)) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		this.updateReceiptHistory(player, data, PurchaseId);

		const [success] = document.save().await();
		if (!success) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	private updateReceiptHistory(player: Player, data: PlayerData, purchaseId: string): void {
		const { receiptHistory } = data.mtx;

		let updatedReceiptHistory = Sift.Array.push(receiptHistory, purchaseId);
		if (updatedReceiptHistory.size() > this.purchaseIdLog) {
			updatedReceiptHistory = Sift.Array.shift(
				updatedReceiptHistory,
				updatedReceiptHistory.size() - this.purchaseIdLog + 1,
			);
		}

		store.updateReceiptHistory(player, updatedReceiptHistory);
	}

	/** @ignore */
	public onInit(): void {
		MarketplaceService.PromptGamePassPurchaseFinished.Connect(
			this.playerService.withPlayerEntity((playerEntity, gamePassId, purchased) => {
				if (!purchased) {
					return;
				}

				this.grantGamePass(playerEntity, gamePassId);
			}),
		);

		MarketplaceService.ProcessReceipt = (...args): Enum.ProductPurchaseDecision => {
			const result = this.processReceipt(...args).expect();
			this.logger.Info(`ProcessReceipt result: ${result}`);
			return result;
		};

		void this.initRegister();
	}

	/** @ignore */
	public onStart(): void {
		events.mtx.setGamePassActive.connect(
			this.playerService.withPlayerEntity((playerEntity, gamePassId, active) => {
				this.setGamePassActive(playerEntity, gamePassId, active).catch(err => {
					this.logger.Error(
						`Failed to set game pass ${gamePassId} active for ${playerEntity.UserId}: ${err}`,
					);
				});
			}),
		);
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { player } = playerEntity;

		const gamePasses = store.getState(selectPlayerMtx(player))?.gamePasses;
		if (gamePasses === undefined) {
			return;
		}

		const unowned = Object.values(gamePass).filter(gamePassId => !gamePasses.has(gamePassId));
		for (const gamePassId of unowned) {
			this.checkForGamePassOwned(playerEntity, gamePassId)
				.then(owned => {
					if (!owned) {
						return;
					}

					this.grantGamePass(playerEntity, tonumber(gamePassId)!);
				})
				.catch(err => {
					this.logger.Warn(`Error checking game pass ${gamePassId}: ${err}`);
				});
		}

		for (const [id, gamePassData] of gamePasses) {
			this.notifyProductActive(playerEntity, id, gamePassData.active);
		}
	}
}
