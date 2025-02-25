import type { InferState } from "@rbxts/reflex";
import { combineProducers } from "@rbxts/reflex";

import { receiverMiddleware } from "client/store/middleware/receiver";
import { slices } from "shared/store";
import { profilerMiddleware } from "shared/store/middleware/profiler";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export const store = combineProducers({ ...slices });

store.applyMiddleware(profilerMiddleware, receiverMiddleware());
