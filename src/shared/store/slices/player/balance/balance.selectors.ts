import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";
import type { BalanceState } from "shared/store/slices/player/balance/balance.slice";
import { selectPlayerData } from "shared/store/slices/player/player.selectors";

export function selectPlayerBalance(
	player: Player,
): (state: SharedState) => BalanceState | undefined {
	return createSelector(selectPlayerData(player), state => state?.balance);
}
