import { IS_DEV, PLACE_ID } from "shared/constants/core";

// NOTE: define before use.
export enum GameId {
	Development = 7035630323,
	Production = 2
}

function isGameId(value: number): value is GameId {
	return value in GameId;
}

export function getConfigValueForGame<const T>(gameIdToValueTable: Record<GameId, T>): T {
	if (IS_DEV && PLACE_ID === 0) return gameIdToValueTable[GameId.Development];

	assert(isGameId(game.GameId), `Invalid game id for place: ${game.GameId}`);
	return gameIdToValueTable[game.GameId];
}
