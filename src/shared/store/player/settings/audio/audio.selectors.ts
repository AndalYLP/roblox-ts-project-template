import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";

import { selectPlayerSettingsData } from "../settings.selectors";
import type { AudioState } from "./audio.slice";

export function selectPlayerAchievements(
	player: Player,
): (state: SharedState) => AudioState | undefined {
	return createSelector(selectPlayerSettingsData(player), state => state?.audio);
}
