import { SharedState } from "shared/store";

export function selectPlayerAchievements(playerId: string) {
	return (state: SharedState) => state.players.achievements[playerId];
}
