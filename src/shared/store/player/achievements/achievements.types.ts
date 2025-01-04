import { Badge } from "types/enum/badge";

export interface PlayerAchievements {
	readonly badges: Map<Badge, boolean>;
}

export const defaultPlayerAchievements: PlayerAchievements = { badges: new Map<Badge, boolean>() };

export type PlayerAchievementsType = keyof PlayerAchievements;
