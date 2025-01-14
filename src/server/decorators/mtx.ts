/* eslint-disable @typescript-eslint/naming-convention */
import { Modding, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import Signal from "@rbxts/signal";
import { MtxService } from "server/services/mtx";
import { GamePass, Product } from "types/enum/mtx";

const registeredProductHandlers = new Map<
	Product,
	{ object: Record<string, Callback>; callback: Callback; args?: unknown[] }
>();
const onProductAdded = new Signal<
	(object: Record<string, Callback>, callback: Callback, product: Product, ...args: unknown[]) => void
>();
const gamePassCallbacks = new Map<GamePass, Array<{ object: Record<string, Callback>; callback: Callback }>>();

/**
 * Register a method to be called when a game pass status changes.
 *
 * The method will be called with the `PlayerEntity`, and whether the game pass is active.
 * @param gamePass The game pass to listen for.
 * @example
 * (method) (playerEntity: PlayerEntity, isActive: boolean): void
 */
export const GamePassStatusChanged = Modding.createDecorator<[gamePass: GamePass]>(
	"Method",
	(descriptor, [gamePass]) => {
		const object = <Record<string, Callback>>Modding.resolveSingleton(descriptor.constructor!);
		const callback = object[descriptor.property];

		gamePassCallbacks.set(gamePass, [{ object, callback }, ...(gamePassCallbacks.get(gamePass) ?? [])]);
	}
);

/**
 * Registers a `method` as a handler for a specific product. The handler will be called
 * when a player purchases the developer product.
 *
 * The handler should return true if the product was successfully processed,
 * or false if there was an error. The handler will also return false if
 * there is an error processing the product.
 * @param product - The ID of the product to register the handler for.
 * @example
 * (method) (playerEntity: PlayerEntity, product: Product): boolean
 * @note Handlers should be registered before the player purchases the
 *  product, and should never yield.
 */
export const RegisterProductHandler = Modding.createDecorator<[product: Product]>("Method", (descriptor, [product]) => {
	const object = <Record<string, Callback>>Modding.resolveSingleton(descriptor.constructor!);
	const callback = object[descriptor.property];

	if (registeredProductHandlers.has(product)) {
		Log.Error(`Handler already registered for product ${product}`);
		return;
	}

	registeredProductHandlers.set(product, { object, callback });
	onProductAdded.Fire(object, callback, product);
});

/**
 * Registers a `method` as a handler for specific developer products. The handler will
 * be invoked when a player purchases one of the registered products.
 *
 * The handler should return `true` if the product was successfully processed, or `false`
 * if there was an error. Attempting to register a handler for a product that already has
 * one will result in an error being logged.
 * @param products - A record mapping a key to their associated ID.
 * @example
 * (method) (playerEntity: PlayerEntity, product: Product, key: string | number): boolean
 * @note Handlers must be registered before the player attempts to purchase a product.
 *       Handlers should not yield or perform any asynchronous operations.
 */
export const RegisterHandlerForEachProduct = Modding.createDecorator<[products: Record<string | number, Product>]>(
	"Method",
	(descriptor, [products]) => {
		const object = <Record<string, Callback>>Modding.resolveSingleton(descriptor.constructor!);
		const callback = object[descriptor.property];

		for (const [key, product] of pairs(products)) {
			if (registeredProductHandlers.has(product)) {
				Log.Error(`Handler already registered for product ${product}`);
				return;
			}

			registeredProductHandlers.set(product, { object, callback, args: [key] });
			onProductAdded.Fire(object, callback, product, key);
		}
	}
);

/**
 * Handles the callbacks registered by the `gamePassStatusChanged` decorator.
 * @ignore
 */
@Service()
export class MtxDecoratorService implements OnStart {
	constructor(private readonly mtxService: MtxService) {}

	/** @ignore */
	public onStart(): void {
		this.mtxService.gamePassStatusChanged.Connect((playerEntity, gamePassId, isActive) => {
			const callbacksFromId = gamePassCallbacks.get(gamePassId);

			if (callbacksFromId) {
				for (const { callback, object } of callbacksFromId) callback(object, playerEntity, isActive);
			}
		});

		for (const [product, { object, callback, args }] of registeredProductHandlers) {
			Promise.defer(() => {
				this.mtxService.registerProductHandler(object, product, callback, ...(args || []));
			});
		}

		onProductAdded.Connect((object, callback, product, ...args) => {
			this.mtxService.registerProductHandler(object, product, callback, ...args);
		});
	}
}
