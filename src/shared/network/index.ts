import { Networking } from "@flamework/networking";

import type {
	MtxClientToServerEvents,
	MtxClientToServerFunctions,
} from "shared/network/remotes/mtx";
import type {
	StoreClientToServerEvents,
	StoreServerToClientEvents,
} from "shared/network/remotes/store";

/** Fired by client to server. */
interface ClientToServerEvents {
	mtx: MtxClientToServerEvents;
	store: StoreClientToServerEvents;
}

/** Fired by server to client. */
interface ServerToClientEvents {
	store: StoreServerToClientEvents;
}

/** Fired by client to server. */
interface ClientToServerFunctions {
	mtx: MtxClientToServerFunctions;
}

/** Fired by server to client. */
interface ServerToClientFunctions {
	// This is just an example, use the same organization as ClientToServerFunctions.
	function(parameter1: string): number;
}

export const globalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const globalFunctions = Networking.createFunction<
	ClientToServerFunctions,
	ServerToClientFunctions
>();
