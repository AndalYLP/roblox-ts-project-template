import { Modding, Reflect } from "@flamework/core";

export const FLAMEWORK_DEFAULT_LOAD_ORDER = 1;

export interface ListenerData<T> {
	event: T;
	id: string;
	loadOrder: number;
}

/**
 * Sets up the lifecycle for a given array of listener data.
 *
 * @template T - The type of the listener.
 * @param lifecycle - The array of listener data.
 * @param specifier - The specifier for the listener. This can be passed through
 *   as a generic.
 * @metadata macro
 */
export function setupLifecycle<T extends defined>(
	lifecycle: Array<ListenerData<T>>,
	specifier?: Modding.Generic<T, "id">,
): void {
	assert(specifier, "[setupLifecycle] Specifier is required");

	Modding.onListenerAdded<T>(object => {
		lifecycle.push({
			id: Reflect.getMetadata(object, "identifier") ?? "flamework:unknown",
			event: object,
			loadOrder:
				Reflect.getMetadata(object, "flamework:loadOrder") ?? FLAMEWORK_DEFAULT_LOAD_ORDER,
		});
	}, specifier);

	lifecycle.sort((a, b) => a.loadOrder > b.loadOrder);
}

/**
 * Sets up the lifecycle for a given map of listener data.
 *
 * @template T - The type of the listener.
 * @param index - The key of the listener object used as a unique identifier for
 *   lifecycle management.
 * @param lifecycle - The map containing listener data.
 * @param onAdded - The callback invoked when a listener is added.
 * @param onRemoved - The callback invoked when a listener is removed.
 * @param specifier - The specifier for the listener. This can be passed through
 *   as a generic.
 * @metadata macro
 */
// eslint-disable-next-line ts/max-params -- All params are required
export function setupWithEventsLifecycle<T extends defined>(
	index: keyof T,
	lifecycle: Map<defined, ListenerData<T>>,
	onAdded?: (value: T) => void,
	onRemoved?: (value: T) => void,
	specifier?: Modding.Generic<T, "id">,
): void {
	assert(specifier, "[setupLifecycle] Specifier is required");

	Modding.onListenerAdded<T>(object => {
		lifecycle.set(2, {
			id: Reflect.getMetadata(object, "identifier") ?? "flamework:unknown",
			event: object,
			loadOrder:
				Reflect.getMetadata(object, "flamework:loadOrder") ?? FLAMEWORK_DEFAULT_LOAD_ORDER,
		});
		onAdded?.(object);
	}, specifier);

	Modding.onListenerRemoved<T>(object => {
		lifecycle.delete(object[index] as defined);
		onRemoved?.(object);
	}, specifier);
}
