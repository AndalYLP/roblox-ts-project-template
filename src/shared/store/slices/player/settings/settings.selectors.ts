import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "shared/store";

import { selectPlayerData } from "../player.selectors";
import type { PlayerSettings } from "./settings.types";

export function selectPlayerSettingsData(
	player: Player,
): (state: SharedState) => PlayerSettings | undefined {
	return createSelector(selectPlayerData(player), state => state?.settings);
}
