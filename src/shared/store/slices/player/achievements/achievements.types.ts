import type { Badge } from "types/enum/badge";

export interface PlayerAchievements {
	badges: Map<Badge, boolean>;
}

export const defaultPlayerAchievements: Readonly<PlayerAchievements> = {
	badges: new Map<Badge, boolean>(),
};

export type PlayerAchievementsType = keyof PlayerAchievements;
