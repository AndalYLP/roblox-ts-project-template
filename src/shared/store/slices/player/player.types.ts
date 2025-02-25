import type { PlayerAchievements } from "shared/store/slices/player/achievements/achievements.types";
import { defaultPlayerAchievements } from "shared/store/slices/player/achievements/achievements.types";
import type { PlayerBalance } from "shared/store/slices/player/balance/balance.types";
import { defaultPlayerBalance } from "shared/store/slices/player/balance/balance.types";
import type { PlayerMtx } from "shared/store/slices/player/mtx/mtx.types";
import { defaultPlayerMtx } from "shared/store/slices/player/mtx/mtx.types";
import type { PlayerSettings } from "shared/store/slices/player/settings";
import { defaultPlayerSettings } from "shared/store/slices/player/settings";

export interface PlayerData {
	readonly achievements: PlayerAchievements;
	readonly balance: PlayerBalance;
	readonly mtx: PlayerMtx;
	readonly settings: PlayerSettings;
}

export const defaultPlayerData: Readonly<PlayerData> = {
	achievements: defaultPlayerAchievements,
	balance: defaultPlayerBalance,
	mtx: defaultPlayerMtx,
	settings: defaultPlayerSettings,
};
