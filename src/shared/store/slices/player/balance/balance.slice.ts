import { createProducer } from "@rbxts/reflex";

import type { PlayerData } from "..";
import type { PlayerBalance } from "./balance.types";
import { defaultPlayerBalance } from "./balance.types";

export type BalanceState = Readonly<PlayerBalance>;

const initialState: BalanceState = defaultPlayerBalance;

export const balanceSlice = createProducer(initialState, {
	addBalance: (state, amount: number): BalanceState => {
		return {
			...state,
			currency: state.currency + amount,
		};
	},

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): BalanceState => data.balance,
});
