import { createProducer } from "@rbxts/reflex";

import type { PlayerBalance } from "shared/store/slices/player/balance/balance.types";
import { defaultPlayerBalance } from "shared/store/slices/player/balance/balance.types";
import type { PlayerData } from "shared/store/slices/player/player.types";

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
