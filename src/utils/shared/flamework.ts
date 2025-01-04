/* eslint-disable jsdoc/check-tag-names */
import { Modding, Reflect } from "@flamework/core";

export const FLAMEWORK_DEFAULT_LOAD_ORDER = 1;

export interface ListenerData<T> {
	event: T;
	id: string;
	loadOrder: number;
}

/**
 * Sets up the lifecycle for a given array of listener data.
 * @template T - The type of the listener.
 * @param lifecycle - The array of listener data.
 * @param specifier - The specifier for the listener. This can be passed through
 *   as a generic.
 * @metadata macro
 */
export function setupLifecycle<T extends defined>(
	lifecycle: Array<ListenerData<T>>,
	specifier?: Modding.Generic<T, "id">
): void {
	assert(specifier, "[setupLifecycle] Specifier is required");

	Modding.onListenerAdded<T>((object) => {
		lifecycle.push({
			id: Reflect.getMetadata(object, "identifier") ?? "flamework:unknown",
			event: object,
			loadOrder: Reflect.getMetadata(object, "flamework:loadOrder") ?? FLAMEWORK_DEFAULT_LOAD_ORDER
		});
	}, specifier);

	lifecycle.sort((a, b) => a.loadOrder > b.loadOrder);
}
