import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";

import { selectPlayerData } from "../player.selectors";
import type { PlayerMtx } from "./mtx.types";

export function selectPlayerMtx(player: Player): (state: SharedState) => PlayerMtx | undefined {
	return createSelector(selectPlayerData(player), state => state?.mtx);
}
