import { createSelector } from "@rbxts/reflex";
import { selectPlayerAudioSettings } from "./audio";
import { PlayerSettings } from "./settings.types";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPlayerSettingsData = (playerId: string) => {
	return createSelector(selectPlayerAudioSettings(playerId), (audio): PlayerSettings | undefined => {
		if (!audio) return;

		return { audio };
	});
};
