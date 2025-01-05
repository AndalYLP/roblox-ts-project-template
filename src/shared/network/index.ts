import { Networking } from "@flamework/networking";
import { MtxClientEvents } from "./mtx";
import { StoreClientEvents, StoreServerEvents } from "./store";

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
