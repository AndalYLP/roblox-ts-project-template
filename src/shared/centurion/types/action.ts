import { Flamework } from "@flamework/core";
import { TransformResult, TypeBuilder } from "@rbxts/centurion";
import Object from "@rbxts/object-utils";

import { playersSlices } from "shared/store/slices/player";

const STORE_SLICE_ACTIONS = playersSlices.getActions();
export type ActionKeys = keyof typeof STORE_SLICE_ACTIONS;

const dispatcherGuard = Flamework.createGuard<ActionKeys>();

export const Action = TypeBuilder.create<ActionKeys>("Action")
	.transform(text => {
		if (!dispatcherGuard(text)) {
			return TransformResult.err("Invalid action");
		}

		return TransformResult.ok(text);
	})
	.suggestions(() => Object.keys(STORE_SLICE_ACTIONS))
	.build();
