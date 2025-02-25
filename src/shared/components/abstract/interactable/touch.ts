import { Zone } from "@rbxts/zone-plus";

import { DestroyableComponent } from "shared/components/abstract/destroyable";

export type ZoneOptions = Partial<{
	accuracy: 1 | 2 | 3 | 4;
	autoUpdate: boolean;
	detection: "Centre" | "WholeBody";
}>;

/**
 * Represents a component for creating touch-based interactions. This class is
 * abstract and must be extended to define specific behavior.
 *
 * Based on zone+.
 *
 * @template A The type of attributes associated with this component.
 * @template I The type of instance this component is attached to.
 * @note Use the constructor to define custom settings for the zone.
 * @see https://1foreverhd.github.io/ZonePlus/api/zone/
 */
export abstract class TouchInteractable<
	A extends object = object,
	I extends Instance = Instance,
> extends DestroyableComponent<A, I> {
	/** The zone used for detecting player interactions. */
	protected readonly zone!: Zone;

	/**
	 * Initializes a new touch interactable with the given settings.
	 *
	 * @param zoneOptions - The settings used to configure the zone.
	 */
	constructor({ accuracy, autoUpdate = true, detection }: ZoneOptions) {
		super();

		this.zone = new Zone(this.instance);
		this.janitor.Add(() => {
			this.zone.destroy();
		});

		if (accuracy) {
			this.setAccuracy(accuracy);
		}

		if (detection) {
			this.setDetection(detection);
		}

		this.zone.autoUpdate = autoUpdate;

		// Prevents compilation error.
		if (this.onPlayerEntered as unknown as boolean) {
			this.zone.playerEntered.Connect(player => {
				this.onPlayerEntered?.(player);
			});
		}

		// Prevents compilation error.
		if (this.onPlayerExited as unknown as boolean) {
			this.zone.playerExited.Connect(player => {
				this.onPlayerExited?.(player);
			});
		}
	}

	/**
	 * Called when a player enters the zone.
	 *
	 * @param player - The player who entered the zone.
	 */
	public onPlayerEntered?(player: Player): void;
	/**
	 * Called when a player exits the zone.
	 *
	 * @param player - The player who exited the zone.
	 */
	public onPlayerExited?(player: Player): void;

	/**
	 * Sets the precision of checks based upon the Detection Enum. Defaults to
	 * 3.
	 *
	 * @param accuracy - Accuracy level.
	 */
	protected setAccuracy(accuracy: 1 | 2 | 3 | 4): void {
		this.zone.setAccuracy(accuracy);
	}

	/**
	 * Sets the precision of checks based upon the Detection Enum. Defaults to
	 * 'Automatic'.
	 *
	 * @param detection - Precision level.
	 */
	protected setDetection(detection: "Centre" | "WholeBody"): void {
		this.zone.setDetection(detection);
	}
}
