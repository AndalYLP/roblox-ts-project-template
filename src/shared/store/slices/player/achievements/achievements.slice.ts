import { createProducer } from "@rbxts/reflex";

import type { Badge } from "types/enum/badge";

import type { PlayerData } from "../player.types";
import type { PlayerAchievements } from "./achievements.types";
import { defaultPlayerAchievements } from "./achievements.types";

export type AchievementState = Readonly<PlayerAchievements>;

const initialState: AchievementState = defaultPlayerAchievements;

export const achievementsSlice = createProducer(initialState, {
	/** @ignore */
	awardBadge: (state, badge: Badge, badgeStatus: boolean): AchievementState => {
		return {
			...state,
			badges: new Map([...state.badges]).set(badge, badgeStatus),
		};
	},

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): AchievementState => data.achievements,
});
