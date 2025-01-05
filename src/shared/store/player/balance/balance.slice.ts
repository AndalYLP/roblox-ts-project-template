import { createProducer } from "@rbxts/reflex";
import { PlayerData } from "..";
import { defaultPlayerBalance, PlayerBalance } from "./balance.types";

export type BalanceState = Readonly<PlayerBalance>;

const initialState: BalanceState = defaultPlayerBalance;

export const balanceSlice = createProducer(initialState, {
	addBalance: (state, amount: number): BalanceState => ({
		...state,
		currency: state.currency + amount
	}),

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): BalanceState => data.balance
});
