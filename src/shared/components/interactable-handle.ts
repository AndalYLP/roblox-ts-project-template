import type { OnStart } from "@flamework/core";
import { Controller, Service } from "@flamework/core";

import { type ListenerData, setupWithEventsLifecycle } from "utils/flamework";

export type InteractableInstances = ClickDetector | ProximityPrompt;

export interface OnTrigger {
	instance: InteractableInstances;
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

	private onRemoved({ instance }: OnTrigger): void {
		this.connections.get(instance)?.Disconnect();
	}
}
