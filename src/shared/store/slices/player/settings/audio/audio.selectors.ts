import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";
import type { AudioState } from "shared/store/slices/player/settings/audio/audio.slice";
import { selectPlayerSettingsData } from "shared/store/slices/player/settings/settings.selectors";

export function selectPlayerSettingsAudio(
	player: Player,
): (state: SharedState) => AudioState | undefined {
	return createSelector(selectPlayerSettingsData(player), state => state?.audio);
}
