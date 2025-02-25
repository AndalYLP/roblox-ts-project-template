import Make from "@rbxts/make";

import { DestroyableComponent } from "shared/components/abstract/destroyable";

export type clickDetectorSettings = Partial<
	Pick<ClickDetector, WritablePropertyNames<ClickDetector>>
>;

/**
 * Represents a component for creating click-based interactions. This class is
 * abstract and must be extended to define specific behavior when triggered.
 *
 * @template A The type of attributes associated with this component.
 * @template I The type of instance this component is attached to.
 * @note Use the constructor to define custom settings for the click detector.
 */
export abstract class ClickableInteractable<
	A extends object = object,
	I extends Instance = Instance,
> extends DestroyableComponent<A, I> {
	/**
	 * The click detector used to detect player interactions. This is
	 * automatically created and managed by the component.
	 */
	protected readonly interactable!: ClickDetector;

	/**
	 * Determines whether the click detector should be destroyed when the
	 * component is removed.
	 *
	 * @default true
	 */
	protected destroyOnRemove = true;

	/**
	 * Initializes a new clickable interactable with the given settings.
	 *
	 * @param clickDetectorSettings - The settings used to configure the click
	 *   detector.
	 */
	// eslint-disable-next-line max-lines-per-function -- Not assigning methods to prevent overrides.
	constructor(protected readonly clickDetectorSettings: clickDetectorSettings = {}) {
		super();

		this.interactable = Make("ClickDetector", {
			...this.clickDetectorSettings,
			Parent: this.instance,
		});

		this.janitor.Add(() => {
			if (this.destroyOnRemove) {
				this.interactable.Destroy();
			}
		});

		if (this.onClick || this.onTrigger) {
			this.janitor.Add(
				this.interactable.MouseClick.Connect(player => {
					this.onClick?.(player);
					this.onTrigger?.(player);
				}),
			);
		}

		if (this.onRightClick || this.onTrigger) {
			this.janitor.Add(
				this.interactable.RightMouseClick.Connect(player => {
					this.onRightClick?.(player);
					this.onTrigger?.(player);
				}),
			);
		}

		// Prevents compilation error.
		if (this.onHoverEnter as unknown as boolean) {
			this.janitor.Add(
				this.interactable.MouseHoverEnter.Connect(player => {
					this.onHoverEnter?.(player);
				}),
			);
		}

		// Prevents compilation error.
		if (this.onHoverLeave as unknown as boolean) {
			this.janitor.Add(
				this.interactable.MouseHoverLeave.Connect(player => {
					this.onHoverLeave?.(player);
				}),
			);
		}
	}

	/**
	 * Called when the click detector is clicked by a player.
	 *
	 * @param player - The player who clicked the click detector.
	 */
	public onClick?(player: Player): void;

	/**
	 * Called when the click detector is right clicked by a player.
	 *
	 * @param player - The player who right clicked the click detector.
	 */
	public onRightClick?(player: Player): void;

	/**
	 * Called when the player hovers over the click detector's parent.
	 *
	 * @param player - The player who triggered the hover event.
	 */
	public onHoverEnter?(player: Player): void;

	/**
	 * Called when the player stops hovering over the click detector's parent.
	 *
	 * @param player - The player who triggered the hover leave event.
	 */
	public onHoverLeave?(player: Player): void;

	/**
	 * Called when the click detector is triggered by a player. This includes
	 * both left and right mouse clicks.
	 *
	 * @param player - The player who triggered the click detector.
	 */
	public onTrigger?(player: Player): void;
}
