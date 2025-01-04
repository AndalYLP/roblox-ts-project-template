import { SharedState } from "shared/store";

export function selectPlayerBalance(playerId: string) {
	return (state: SharedState) => state.players.balance[playerId];
}
