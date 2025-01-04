import { defaultPlayerAchievements, PlayerAchievements } from "./achievements";
import { defaultPlayerBalance, PlayerBalance } from "./balance";
import { defaultPlayerMtx, PlayerMtx } from "./mtx";
import { defaultPlayerSettings, PlayerSettings } from "./settings";

export interface PlayerData {
	readonly achievements: PlayerAchievements;
	readonly settings: PlayerSettings;
	readonly balance: PlayerBalance;
	readonly mtx: PlayerMtx;
}

export const defaultPlayerData: PlayerData = {
	achievements: defaultPlayerAchievements,
	settings: defaultPlayerSettings,
	balance: defaultPlayerBalance,
	mtx: defaultPlayerMtx
};
