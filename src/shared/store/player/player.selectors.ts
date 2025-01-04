import { createSelector } from "@rbxts/reflex";
import { PlayerData } from ".";
import { selectPlayerAchievements } from "./achievements";
import { selectPlayerBalance } from "./balance";
import { selectPlayerMtx } from "./mtx";
import { selectPlayerSettingsData } from "./settings";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerAchievements(playerId),
		selectPlayerSettingsData(playerId),
		selectPlayerBalance(playerId),
		selectPlayerMtx(playerId),
		(achievements, settings, balance, mtx): PlayerData | undefined => {
			if (!balance || !mtx || !achievements || !settings) return;

			return { balance, mtx, achievements, settings };
		}
	);
};
