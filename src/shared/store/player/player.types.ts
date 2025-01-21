import type { PlayerAchievements } from "./achievements/achievements.types";
import { defaultPlayerAchievements } from "./achievements/achievements.types";
import type { PlayerBalance } from "./balance/balance.types";
import { defaultPlayerBalance } from "./balance/balance.types";
import type { PlayerMtx } from "./mtx/mtx.types";
import { defaultPlayerMtx } from "./mtx/mtx.types";
import type { PlayerSettings } from "./settings";
import { defaultPlayerSettings } from "./settings";

export interface PlayerData {
	readonly achievements: PlayerAchievements;
	readonly balance: PlayerBalance;
	readonly mtx: PlayerMtx;
	readonly settings: PlayerSettings;
}

export const defaultPlayerData: PlayerData = {
	achievements: defaultPlayerAchievements,
	balance: defaultPlayerBalance,
	mtx: defaultPlayerMtx,
	settings: defaultPlayerSettings,
};
