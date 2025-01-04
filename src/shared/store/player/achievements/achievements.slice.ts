import { createProducer } from "@rbxts/reflex";
import { Badge } from "types/enum/badge";
import { PlayerData } from "../player.types";
import { PlayerAchievements } from "./achievements.types";

export type AchievementState = Readonly<Record<string, PlayerAchievements | undefined>>;

const initialState: AchievementState = {};

export const achievementsSlice = createProducer(initialState, {
	/** @ignore */
	awardBadge: (state, player: string, badge: Badge, badgeStatus: boolean): AchievementState => {
		const achievements = state[player];
		return {
			...state,
			[player]: achievements && {
				...achievements,
				badges: new Map([...achievements.badges]).set(badge, badgeStatus)
			}
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData): AchievementState => {
		return {
			...state,
			[player]: data.achievements
		};
	},

	/** @ignore */
	closePlayerData: (state, player: string): AchievementState => {
		return {
			...state,
			[player]: undefined
		};
	}
});
