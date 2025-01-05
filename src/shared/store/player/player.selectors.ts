import { SharedState } from "..";

export const selectPlayerData = (player: Player) => {
	return (state: SharedState) => state.players.get(player);
};
