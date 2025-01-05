/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from "@rbxts/reflex";
import { selectPlayerSettingsData } from "../settings.selectors";

export function selectPlayerAchievements(player: Player) {
	return createSelector(selectPlayerSettingsData(player), (state) => state?.audio);
}
