import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";
import { profilerMiddleware } from "shared/store/middleware/profiler";
import { receiverMiddleware } from "./middleware/receiver";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export const store = combineProducers({ ...slices });

store.applyMiddleware(profilerMiddleware, receiverMiddleware());
