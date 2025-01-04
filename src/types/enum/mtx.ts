import { GameId, getConfigValueForGame } from "shared/functions/game-config";

// NOTE: define before use.
export const gamePass = {
	Example: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "2"
	})
} as const;

// NOTE: define before use.
export const product = {
	Example: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "2"
	})
};

export type GamePass = ValueOf<typeof gamePass>;
export type Product = ValueOf<typeof product>;

export interface GamePassData {
	active: boolean;
}

export interface ProductData {
	purchaseInfo: Array<{
		purchasePrice: number;
		purchaseTime: number;
	}>;
	timesPurchased: number;
}
