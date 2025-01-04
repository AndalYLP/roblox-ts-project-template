import { combineProducers } from "@rbxts/reflex";
import { audioSlice } from "./audio";

export * from "./settings.selectors";
export * from "./settings.types";

export const settingsSlices = combineProducers({
	audio: audioSlice
});
