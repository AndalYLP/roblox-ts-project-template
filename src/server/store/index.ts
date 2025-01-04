import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/store";
import { profilerMiddleware } from "shared/store/middleware/profiler";
import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootStore = typeof store;
export type RootState = InferState<typeof store>;

export const store = combineProducers({ ...slices });

store.applyMiddleware(profilerMiddleware, broadcasterMiddleware());
