import { combineProducers } from "@rbxts/reflex";
import { withMultiplayer } from "shared/functions/withMultiplayer";
import { achievementsSlice } from "./achievements/achievements.slice";
import { balanceSlice } from "./balance/balance.slice";
import { mtxSlice } from "./mtx/mtx.slice";
import { settingsSlices } from "./settings";

export * from "./player.selectors";
export * from "./player.types";

export const playersSlices = combineProducers({
	achievements: achievementsSlice,
	settings: settingsSlices,
	balance: balanceSlice,
	mtx: mtxSlice
}).enhance(withMultiplayer);
