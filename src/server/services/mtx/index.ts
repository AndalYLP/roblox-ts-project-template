import { OnInit, OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { MarketplaceService, Players } from "@rbxts/services";
import Sift from "@rbxts/sift";
import Signal from "@rbxts/signal";
import { noYield } from "@utils/no-yield";
import { events } from "server/network";
import { store } from "server/store";
import { PlayerData, selectPlayerData } from "shared/store/player";
import { selectPlayerMtx } from "shared/store/player/mtx/mtx.selectors";
import { GamePass, gamePass, product, Product } from "types/enum/mtx";
import { OnPlayerJoin, PlayerService } from "../player";
import { PlayerEntity } from "../player/entity";

const NETWORK_RETRY_DELAY = 2;
const NETWORK_RETRY_ATTEMPTS = 10;

type ProductInfo = DeveloperProductInfo | GamePassProductInfo;

/**
 * A service for managing game passes and processing receipts.
 *
 * #### Use the decorator instead of connecting to `gamePassStatusChanged` directly.
 * #### Use the decorator instead of calling `RegisterProductHandler` directly.
 * @example
 * ```
 * ⁣@Service()
 * export class MtxEventsService {
 *		⁣@gamePassStatusChanged()
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
	private readonly productHandlers = new Map<
		Product,
		{
			handler: (
				object: Record<string, Callback>,
				playerEntity: PlayerEntity,
				productId: Product,
				...args: unknown[]
			) => boolean;
			object: Record<string, Callback>;
			args: unknown[];
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
		private readonly playerService: PlayerService
	) {}

	/**
	 * Used internally by the `RegisterProductHandler` decorator to register a handler for a specific product.
	 * @param object the method's (handler) object
	 * @param productId - The ID of the product to register the handler for.
	 * @param handler - The handler to call when the player purchases the product.
	 * @ignore
	 */
	public registerProductHandler(
		object: Record<string, Callback>,
		productId: Product,
		handler: (object: Record<string, Callback>, playerEntity: PlayerEntity, productId: Product) => boolean,
		...args: unknown[]
	): void {
		if (this.productHandlers.has(productId)) {
			this.logger.Error(`Handler already registered for product ${productId}`);
			return;
		}

		this.logger.Debug(`Registered handler for product ${productId}`);
		this.productHandlers.set(productId, { handler, object, args });
	}

	/**
	 * Retrieves the product information for a given product or game pass.
	 * @param infoType - The type of information to retrieve ("Product" or
	 *   "GamePass").
	 * @param productId - The ID of the product or game pass.
	 * @returns A Promise that resolves to the product information, or undefined
	 *   if the information is not available.
	 */
	public async getProductInfo(infoType: Enum.InfoType, productId: number): Promise<ProductInfo | undefined> {
		if (this.productInfoCache.has(productId)) return this.productInfoCache.get(productId);

		const productInfo = await Promise.retryWithDelay(
			async () => MarketplaceService.GetProductInfo(productId, infoType) as ProductInfo,
			NETWORK_RETRY_ATTEMPTS,
			NETWORK_RETRY_DELAY
		).catch(() => {
			this.logger.Warn(`Failed to get price for product ${productId}`);
		});

		if (productInfo === undefined) return undefined;

		this.productInfoCache.set(productId, productInfo);

		return productInfo;
	}

	/**
	 * Checks if a game pass is active for a specific player. This method will
	 * return false if the game pass is not owned by the player.
	 * @param playerEntity - The player entity for whom to check the game pass.
	 * @param playerEntity.player The player's instance.
	 * @param gamePassId - The ID of the game pass to check.
	 * @returns A boolean indicating whether the game pass is active or not.
	 */
	public isGamePassActive({ player }: PlayerEntity, gamePassId: GamePass): boolean {
		return store.getState(selectPlayerMtx(player))?.gamePasses.get(gamePassId)?.active ?? false;
	}

	private async checkForGamePassOwned({ player }: PlayerEntity, gamePassId: GamePass): Promise<boolean> {
		if (!Object.values(gamePass).includes(gamePassId)) throw `Invalid game pass id ${gamePassId}`;

		const owned = store.getState(selectPlayerMtx(player))?.gamePasses.has(gamePassId);
		if (owned === true) return true;

		return MarketplaceService.UserOwnsGamePassAsync(player.UserId, tonumber(gamePassId) as number);
	}

	private grantProduct(playerEntity: PlayerEntity, productId: number, currencySpent: number): boolean {
		const { UserId, player } = playerEntity;

		const productIds = tostring(productId) as Product;

		if (!Object.values(product).includes(productIds)) {
			this.logger.Warn(`Player ${UserId} attempted to purchased invalid product ${productId}`);
			return false;
		}

		const data = this.productHandlers.get(productIds);
		if (!data) {
			this.logger.Fatal(`No handler for product ${productIds}`);
			return false;
		}

		const [success, result] = pcall(() =>
			noYield(data.handler, data.object, playerEntity, productIds, ...data.args)
		);
		if (!success || !result) {
			this.logger.Error(`Failed to process product ${productIds}`);
			return false;
		}

		this.logger.Info(`Player ${UserId} purchased developer product ${productId}`);
		store.purchaseDeveloperProduct(player, productIds, currencySpent);
		return true;
	}

	private async setGamePassActive(playerEntity: PlayerEntity, gamePassId: GamePass, active: boolean): Promise<void> {
		await this.checkForGamePassOwned(playerEntity, gamePassId).then((owned) => {
			const { UserId, player } = playerEntity;
			if (!owned) {
				this.logger.Warn(
					`Player ${UserId} tried to activate not game pass ${gamePassId} that they do not own.`
				);

				return;
			}

			store.setGamePassActive(player, gamePassId, active);
			this.notifyProductActive(playerEntity, gamePassId, active);
		});
	}

	private notifyProductActive(playerEntity: PlayerEntity, productId: GamePass, isActive: boolean): void {
		this.gamePassStatusChanged.Fire(playerEntity, productId, isActive);
	}

	private grantGamePass(playerEntity: PlayerEntity, gamePassId: number): void {
		const { UserId, player } = playerEntity;
		const gamePassIds = tostring(gamePassId) as GamePass;

		if (!Object.values(gamePass).includes(gamePassIds)) {
			this.logger.Warn(`Player ${UserId} attempted to purchased invalid game pass ${gamePassId}`);
			return;
		}

		this.logger.Info(`Player ${UserId} purchased game pass ${gamePassId}`);
		store.purchaseGamePass(player, gamePassIds);
		this.notifyProductActive(playerEntity, gamePassIds, true);
	}

	private async processReceipt(receiptInfo: ReceiptInfo): Promise<Enum.ProductPurchaseDecision> {
		this.logger.Info(`Processing receipt ${receiptInfo.PurchaseId} for ${receiptInfo.PlayerId}`);

		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
		if (!player) return Enum.ProductPurchaseDecision.NotProcessedYet;

		const playerEntity = await this.playerService.getPlayerEntityAsync(player);
		if (!playerEntity) {
			this.logger.Error(`No entity for player ${player.UserId}, cannot process receipt`);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return this.purchaseIdCheck(playerEntity, receiptInfo);
	}

	private async purchaseIdCheck(
		playerEntity: PlayerEntity,
		{ CurrencySpent, ProductId, PurchaseId }: ReceiptInfo
	): Promise<Enum.ProductPurchaseDecision> {
		const { document, player } = playerEntity;

		if (document.read().mtx.receiptHistory.includes(PurchaseId)) {
			const [success] = document.save().await();
			if (!success) return Enum.ProductPurchaseDecision.NotProcessedYet;

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		}

		const data = store.getState(selectPlayerData(player));
		if (!data) return Enum.ProductPurchaseDecision.NotProcessedYet;

		if (!this.grantProduct(playerEntity, ProductId, CurrencySpent))
			return Enum.ProductPurchaseDecision.NotProcessedYet;

		this.updateReceiptHistory(player, data, PurchaseId);

		const [success] = document.save().await();
		if (!success) return Enum.ProductPurchaseDecision.NotProcessedYet;

		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	private updateReceiptHistory(player: Player, data: PlayerData, purchaseId: string): void {
		const { receiptHistory } = data.mtx;

		let updatedReceiptHistory = Sift.Array.push(receiptHistory, purchaseId);
		if (updatedReceiptHistory.size() > this.purchaseIdLog) {
			updatedReceiptHistory = Sift.Array.shift(
				updatedReceiptHistory,
				updatedReceiptHistory.size() - this.purchaseIdLog + 1
			);
		}

		store.updateReceiptHistory(player, updatedReceiptHistory);
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { player } = playerEntity;

		const gamePasses = store.getState(selectPlayerMtx(player))?.gamePasses;
		if (gamePasses === undefined) return;

		const unowned = Object.values(gamePass).filter((gamePassId) => !gamePasses.has(gamePassId));
		for (const gamePassId of unowned) {
			this.checkForGamePassOwned(playerEntity, gamePassId)
				.then((owned) => {
					if (!owned) return;

					this.grantGamePass(playerEntity, tonumber(gamePassId) as number);
				})
				.catch((e) => {
					this.logger.Warn(`Error checking game pass ${gamePassId}: ${e}`);
				});
		}

		for (const [id, gamePassData] of gamePasses) {
			this.notifyProductActive(playerEntity, id, gamePassData.active);
		}
	}

	/** @ignore */
	public onInit(): void {
		MarketplaceService.PromptGamePassPurchaseFinished.Connect(
			this.playerService.withPlayerEntity((playerEntity, gamePassId, purchased) => {
				if (!purchased) return;

				this.grantGamePass(playerEntity, gamePassId);
			})
		);

		MarketplaceService.ProcessReceipt = (...args): Enum.ProductPurchaseDecision => {
			const result = this.processReceipt(...args).expect();
			this.logger.Info(`ProcessReceipt result: ${result}`);
			return result;
		};
	}

	/** @ignore */
	public onStart(): void {
		events.mtx.setGamePassActive.connect(
			this.playerService.withPlayerEntity((playerEntity, gamePassId, active) => {
				this.setGamePassActive(playerEntity, gamePassId, active).catch((e) => {
					this.logger.Error(`Failed to set game pass ${gamePassId} active for ${playerEntity.UserId}: ${e}`);
				});
			})
		);
	}
}
