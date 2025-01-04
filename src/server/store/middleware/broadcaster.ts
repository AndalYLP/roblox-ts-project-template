import { BroadcastAction, createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import { events } from "server/network";
import { IS_DEV, IS_EDIT } from "shared/constants/core";
import { SerializedSharedState, SharedState, slices, stateSerDes } from "shared/store";

/**
 * A middleware that listens for actions dispatched from the server and
 * dispatches them to the client.
 * @returns The middleware function.
 */
export function broadcasterMiddleware(): ProducerMiddleware {
	// Storybook support
	if (IS_DEV && IS_EDIT) {
		return () => (innerDispatch) => innerDispatch;
	}

	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch,
		hydrate,
		beforeHydrate
	});

	events.store.start.connect((player) => {
		broadcaster.start(player);
	});

	return broadcaster.middleware;
}

function beforeHydrate(player: Player, state: SharedState): SharedState {
	return stateSerDes.serialize(state) as unknown as SharedState;
}

function dispatch(player: Player, actions: Array<BroadcastAction>): void {
	events.store.dispatch.fire(player, actions);
}

function hydrate(player: Player, state: SharedState): void {
	events.store.hydrate.fire(player, state as unknown as SerializedSharedState);
}
