import type { OnStart } from "@flamework/core";
import { Controller, Service } from "@flamework/core";

import { type ListenerData, setupWithEventsLifecycle } from "utils/flamework";

export type InteractableInstances = ClickDetector | ProximityPrompt;

export interface OnTrigger {
	instance: InteractableInstances;
	/**
	 * Called when the player triggers the interactable instance, Triggered for
	 * `ProximityPrompt` and LeftClick for `ClickDetector`.
	 *
	 * @param player - The player who triggered the interactable instance.
	 */
	onTrigger(player: Player): void;
}

@Service()
@Controller()
export class Interactable implements OnStart {
	private readonly connections = new Map<InteractableInstances, RBXScriptConnection>();
	private readonly onTriggerEvents = new Map<InteractableInstances, ListenerData<OnTrigger>>();

	/** @ignore */
	public onStart(): void {
		setupWithEventsLifecycle<OnTrigger>(
			"instance",
			this.onTriggerEvents,
			event => {
				this.onAdded(event);
			},
			event => {
				this.onRemoved(event);
			},
		);
	}

	/**
	 * Handles the addition of an interactable life cycle.
	 *
	 * @param event - The event data that includes the interactable instance and
	 *   its onTrigger callback.
	 */
	private onAdded(event: OnTrigger): void {
		const { instance } = event;

		let connection: RBXScriptConnection;
		if (instance.IsA("ClickDetector")) {
			connection = instance.MouseClick.Connect(player => {
				event.onTrigger(player);
			});
		} else {
			connection = instance.Triggered.Connect(player => {
				event.onTrigger(player);
			});
		}

		this.connections.set(instance, connection);
	}

	/**
	 * Handles the removal of an interactable life cycle.
	 *
	 * @param event - The event data that includes the interactable instance to
	 *   be removed.
	 */
	private onRemoved({ instance }: OnTrigger): void {
		this.connections.get(instance)?.Disconnect();
	}
}
