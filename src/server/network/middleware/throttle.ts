import type { Networking } from "@flamework/networking";
import { setTimeout } from "@rbxts/set-timeout";

/**
 * Creates a middleware that throttles the event for each player.
 *
 * See [David Corbacho's
 * article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `throttle` and `debounce`.
 *
 * @param time - The function to throttle.
 * @returns The event middleware.
 */
export function throttleMiddleware(time: number): Networking.EventMiddleware {
	const throttle = new Set<Player>();

	return processNext => {
		return (player, ...args) => {
			if (!player) {
				return;
			}

			if (throttle.has(player)) {
				return;
			}

			throttle.add(player);
			setTimeout(() => {
				throttle.delete(player);
			}, time);

			void processNext(player, ...args);
		};
	};
}
