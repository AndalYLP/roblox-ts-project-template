import Make from "@rbxts/make";

import { IS_CLIENT } from "shared/constants/core";

import { DestroyableComponent } from "../destroyable";

export type ProximitySettings = Partial<
	Pick<ProximityPrompt, WritablePropertyNames<ProximityPrompt>>
>;

/**
 * Represents a component for creating proximity-based interactions. This class
 * is abstract and must be extended to define specific behavior when triggered.
 *
 * @template A The type of attributes associated with this component.
 * @template I The type of instance this component is attached to.
 * @note Use the constructor to define custom settings for the proximity prompt.
 */
export abstract class ProximityInteractable<
	A extends object = object,
	I extends Instance = Instance,
> extends DestroyableComponent<A, I> {
	/**
	 * The proximity prompt used to detect player interactions. This is
	 * automatically created and managed by the component.
	 */
	protected readonly interactable!: ProximityPrompt;

	/**
	 * Determines whether the proximity prompt should be destroyed when the
	 * component is removed.
	 *
	 * @default true
	 */
	protected destroyOnRemove = true;

	/**
	 * Initializes a new proximity interactable with the given settings.
	 *
	 * @param proximitySettings - The settings used to configure the proximity
	 *   prompt.
	 */
	// eslint-disable-next-line max-lines-per-function -- Not assigning methods to prevent overrides.
	constructor(protected readonly proximitySettings: ProximitySettings = {}) {
		super();

		this.interactable = Make("ProximityPrompt", {
			...this.proximitySettings,
			Parent: this.instance,
		});

		this.janitor.Add(() => {
			if (this.destroyOnRemove) {
				this.interactable.Destroy();
			}
		});

		// Prevents compilation error.
		if (this.onTrigger as unknown as boolean) {
			this.janitor.Add(
				this.interactable.Triggered.Connect(player => {
					this.onTrigger?.(player);
				}),
			);
		}

		// Prevents compilation error.
		if (this.onTriggerEnded as unknown as boolean) {
			this.janitor.Add(
				this.interactable.TriggerEnded.Connect(player => {
					this.onTriggerEnded?.(player);
				}),
			);
		}

		if (this.onHidden || this.onShown) {
			if (IS_CLIENT) {
				this.janitor.Add(
					this.interactable.PromptHidden.Connect(() => {
						this.onHidden?.();
					}),
				);

				this.janitor.Add(
					this.interactable.PromptShown.Connect(() => {
						this.onShown?.();
					}),
				);
			} else {
				warn(
					"Not connecting shown/hidden events: These events are only available on the client.",
				);
			}
		}

		if (this.onHoldBegan || !this.onHoldEnded) {
			const { HoldDuration } = proximitySettings;
			if (HoldDuration !== undefined && HoldDuration > 0) {
				this.janitor.Add(
					this.interactable.PromptButtonHoldBegan.Connect(player => {
						this.onHoldBegan?.(player);
					}),
				);

				this.janitor.Add(
					this.interactable.PromptButtonHoldEnded.Connect(player => {
						this.onHoldEnded?.(player);
					}),
				);
			} else {
				warn(
					"Not connecting hold events: When using onHoldBegin or onHoldEnd, HoldDuration must be greater than 0.",
				);
			}
		}
	}

	/**
	 * Called when the proximity prompt is triggered by a player.
	 *
	 * @param player - The player who triggered the prompt.
	 */
	public onTrigger?(player: Player): void;

	/**
	 * Called when the proximity prompt is no longer being triggered by a
	 * player.
	 *
	 * @param player - The player who stopped triggering the prompt.
	 */
	public onTriggerEnded?(player: Player): void;

	/**
	 * Called when the player begins holding the proximity prompt.
	 *
	 * @param player - The player who started holding the prompt.
	 */
	public onHoldBegan?(player: Player): void;

	/**
	 * Called when the player ends holding the proximity prompt.
	 *
	 * @param player - The player who stopped holding the prompt.
	 */
	public onHoldEnded?(player: Player): void;

	/**
	 * Called when the proximity prompt is shown to the `LocalPlayer`.
	 *
	 * @client
	 */
	public onShown?(): void;

	/**
	 * Called when the proximity prompt is hidden from the `LocalPlayer`.
	 *
	 * @client
	 */
	public onHidden?(): void;
}
