import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";

import { selectPlayerData } from "../player.selectors";
import type { BalanceState } from "./balance.slice";

export function selectPlayerBalance(
	player: Player,
): (state: SharedState) => BalanceState | undefined {
	return createSelector(selectPlayerData(player), state => state?.balance);
}
