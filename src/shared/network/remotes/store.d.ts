import type { BroadcastAction } from "@rbxts/reflex";

import type { SerializedSharedState } from "shared/store";

export interface StoreClientToServerEvents {
	/** Called by the client when they are ready to receive data from the server. */
	start: () => void;
}

export interface StoreServerToClientEvents {
	/**
	 * Sends state updates to the client.
	 *
	 * @param actions - The actions to send to the client.
	 */
	dispatch: (actions: Array<BroadcastAction>) => void;
	hydrate: (state: SerializedSharedState) => void;
}
