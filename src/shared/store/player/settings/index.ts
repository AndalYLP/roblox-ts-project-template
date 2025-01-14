import { combineProducers } from "@rbxts/reflex";
import { audioSlice } from "./audio/audio.slice";

export * from "./settings.selectors";
export * from "./settings.types";

export const settingsSlices = combineProducers({
	audio: audioSlice
});
