import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";
import { selectPlayerData } from "shared/store/slices/player/player.selectors";
import type { PlayerSettings } from "shared/store/slices/player/settings/settings.types";

export function selectPlayerSettingsData(
	player: Player,
): (state: SharedState) => PlayerSettings | undefined {
	return createSelector(selectPlayerData(player), state => state?.settings);
}
