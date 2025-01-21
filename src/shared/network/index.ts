import { Networking } from "@flamework/networking";

import type { MtxClientEvents } from "./remotes/mtx";
import type { StoreClientEvents, StoreServerEvents } from "./remotes/store";

/** Fired by client to server. */
interface ClientToServerEvents {
	mtx: MtxClientEvents;
	store: StoreClientEvents;
}

/** Fired by server to client. */
interface ServerToClientEvents {
	store: StoreServerEvents;
}

export const globalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
