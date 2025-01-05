/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from "@rbxts/reflex";
import { selectPlayerData } from "../player.selectors";

export function selectPlayerMtx(player: Player) {
	return createSelector(selectPlayerData(player), (state) => state?.mtx);
}
