import { GameId, getConfigValueForGame } from "shared/functions/game-config";

// NOTE: define before use.
export const badge = {
	Welcome: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "2",
	}),
} as const;

export type Badge = ValueOf<typeof badge>;
