import { createProducer } from "@rbxts/reflex";
import { Badge } from "types/enum/badge";
import { PlayerData } from "../player.types";
import { defaultPlayerAchievements, PlayerAchievements } from "./achievements.types";

export type AchievementState = Readonly<PlayerAchievements>;

const initialState: AchievementState = defaultPlayerAchievements;

export const achievementsSlice = createProducer(initialState, {
	/** @ignore */
	awardBadge: (state, badge: Badge, badgeStatus: boolean): AchievementState => ({
		...state,
		badges: new Map([...state.badges]).set(badge, badgeStatus)
	}),

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): AchievementState => data.achievements
});
