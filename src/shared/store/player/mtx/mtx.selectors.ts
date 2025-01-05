import { SharedState } from "shared/store";

export function selectPlayerMtx(player: Player) {
	return (state: SharedState) => state.players.mtx.get(player);
}
