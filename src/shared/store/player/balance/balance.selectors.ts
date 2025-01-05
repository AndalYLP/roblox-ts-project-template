import { SharedState } from "shared/store";

export function selectPlayerBalance(player: Player) {
	return (state: SharedState) => state.players.balance.get(player);
}
