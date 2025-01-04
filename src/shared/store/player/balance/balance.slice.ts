import { createProducer } from "@rbxts/reflex";
import { PlayerBalance } from ".";
import { PlayerData } from "..";

export type BalanceState = Readonly<Record<string, PlayerBalance | undefined>>;

const initialState: BalanceState = {};

export const balanceSlice = createProducer(initialState, {
	addBalance: (state, player: string, amount: number): BalanceState => {
		const balance = state[player];
		return {
			...state,
			[player]: balance && {
				...balance,
				currency: balance.currency + amount
			}
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData): BalanceState => ({
		...state,
		[player]: data.balance
	}),

	/** @ignore */
	closePlayerData: (state, player: string): BalanceState => ({
		...state,
		[player]: undefined
	})
});
