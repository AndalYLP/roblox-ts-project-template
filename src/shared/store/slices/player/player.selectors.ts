import type { SharedState } from "../..";

export function selectPlayerData(player: Player) {
	return (state: SharedState) => state.players.get(player);
}
