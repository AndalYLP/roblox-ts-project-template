import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";

import { selectPlayerData } from "../player.selectors";
import type { AchievementState } from "./achievements.slice";

export function selectPlayerAchievements(
	player: Player,
): (state: SharedState) => AchievementState | undefined {
	return createSelector(selectPlayerData(player), state => state?.achievements);
}
