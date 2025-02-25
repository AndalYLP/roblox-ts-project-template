import { createProducer } from "@rbxts/reflex";

import type { PlayerAchievements } from "shared/store/slices/player/achievements/achievements.types";
import { defaultPlayerAchievements } from "shared/store/slices/player/achievements/achievements.types";
import type { PlayerData } from "shared/store/slices/player/player.types";
import type { Badge } from "types/enum/badge";

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
