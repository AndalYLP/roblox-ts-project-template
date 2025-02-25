import { combineProducers } from "@rbxts/reflex";

import { withMultiplayer } from "shared/functions/with-multiplayer";
import { achievementsSlice } from "shared/store/slices/player/achievements/achievements.slice";
import { balanceSlice } from "shared/store/slices/player/balance/balance.slice";
import { mtxSlice } from "shared/store/slices/player/mtx/mtx.slice";
import { settingsSlices } from "shared/store/slices/player/settings";

export * from "shared/store/slices/player/player.selectors";
export * from "shared/store/slices/player/player.types";

export const playersSlices = combineProducers({
	achievements: achievementsSlice,
	balance: balanceSlice,
	mtx: mtxSlice,
	settings: settingsSlices,
}).enhance(withMultiplayer);
