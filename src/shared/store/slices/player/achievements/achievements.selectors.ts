import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";
import type { AchievementState } from "shared/store/slices/player/achievements/achievements.slice";
import { selectPlayerData } from "shared/store/slices/player/player.selectors";

export function selectPlayerAchievements(
	player: Player,
): (state: SharedState) => AchievementState | undefined {
	return createSelector(selectPlayerData(player), state => state?.achievements);
}
