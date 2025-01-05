import { createSelector } from "@rbxts/reflex";
import { selectPlayerAudioSettings } from "./audio";
import { PlayerSettings } from "./settings.types";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPlayerSettingsData = (player: Player) => {
	return createSelector(selectPlayerAudioSettings(player), (audio): PlayerSettings | undefined => {
		if (!audio) return;

		return { audio };
	});
};
