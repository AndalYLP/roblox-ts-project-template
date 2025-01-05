import { SharedState } from "shared/store";

export function selectPlayerAchievements(player: Player) {
	return (state: SharedState) => state.players.achievements.get(player);
}
