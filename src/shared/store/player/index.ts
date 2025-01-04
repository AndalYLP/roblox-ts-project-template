import { combineProducers } from "@rbxts/reflex";
import { achievementsSlice } from "./achievements";
import { balanceSlice } from "./balance";
import { mtxSlice } from "./mtx";
import { settingsSlices } from "./settings";

export * from "./player.selectors";
export * from "./player.types";

export const playersSlices = combineProducers({
	achievements: achievementsSlice,
	settings: settingsSlices,
	balance: balanceSlice,
	mtx: mtxSlice
});
