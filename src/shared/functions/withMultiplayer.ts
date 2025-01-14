/* eslint-disable @typescript-eslint/no-explicit-any */
// https://gist.github.com/sasial-dev/561bbbefd40b75425f325850edfb2b1d

import type { InferActions, InferState, Producer } from "@rbxts/reflex";
import { createProducer } from "@rbxts/reflex";
import { Dictionary as Object } from "@rbxts/sift";

type ReplaceStateParameters<State, Actions> = {
	readonly [K in keyof Actions]: Actions[K] extends (state: any, ...args: infer Args) => any
		? (state: State, player: Player, ...args: Args) => State
		: never;
};

type PlayerActions<State> = {
	readonly removePlayer: (state: State, player: Player) => State;
};

export const withMultiplayer = <
	P extends Producer,
	S extends InferState<P>,
	A extends ReplaceStateParameters<Map<Player, S>, InferActions<P>> & PlayerActions<Map<Player, S>>
>(
	producer: P
): Producer<Map<Player, S>, A> => {
	const actions = Object.map(
		producer.getActions() as Record<string, (state: S, ...args: unknown[]) => S>,
		(action) => {
			return (combinedState: Map<Player, S>, player: Player, ...args: unknown[]) => {
				const nextState = table.clone(combinedState);

				if (!nextState.has(player)) nextState.set(player, producer.getState());

				const producerState = nextState.get(player)!;
				nextState.set(player, action(producerState, ...args));

				return nextState;
			};
		}
	) as never;

	(actions as Writable<PlayerActions<Map<Player, S>>>).removePlayer = (state, player) => {
		const nextState = table.clone(state);
		nextState.delete(player);
		return nextState;
	};

	return createProducer(new Map(), actions);
};
