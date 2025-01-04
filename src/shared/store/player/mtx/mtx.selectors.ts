import { SharedState } from "shared/store";

export function selectPlayerMtx(playerId: string) {
	return (state: SharedState) => state.players.mtx[playerId];
}
