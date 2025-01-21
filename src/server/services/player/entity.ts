import type { Janitor } from "@rbxts/janitor";
import type { Document } from "@rbxts/lapis";

import type { PlayerData } from "shared/store/player";

export class PlayerEntity {
	/** The player's username. */
	public readonly Name: string;
	/** A string representation of the player's UserId. */
	public readonly UserId: string;

	constructor(
		/** The player's instance. */
		public readonly player: Player,
		public readonly janitor: Janitor,
		public readonly document: Document<PlayerData>,
	) {
		this.Name = player.Name;
		this.UserId = tostring(player.UserId);
	}
}
