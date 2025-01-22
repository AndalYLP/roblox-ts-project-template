import { BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

/**
 * An abstract base component that includes functionality for cleaning up
 * resources using a janitor. Designed to be extended by other components.
 *
 * @template A The type of attributes associated with this component.
 * @template I The type of instance this component is attached to.
 */
export abstract class DestroyableComponent<
	A extends object = object,
	I extends Instance = Instance,
> extends BaseComponent<A, I> {
	protected readonly janitor = new Janitor();

	/**
	 * Destroys this component instance and the janitor.
	 *
	 * @note This is fired when the tag is removed, Removing the tag is the correct way to remove a component.
	 * @see https://discord.com/channels/476080952636997633/1213907792394453042/1213916603561943150
	 */
	public override destroy(): void {
		if ("Destroy" in this.janitor) {
			this.janitor.Destroy();
		}

		super.destroy();
	}
}
