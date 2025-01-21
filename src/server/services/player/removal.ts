import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";

import type { KickCode } from "types/enum/kick-reason";

/** This handles removing the player from the game for various reasons. */
@Service()
export class PlayerRemovalService {
	constructor(private readonly logger: Logger) {}

	/**
	 * Removes a player from the server due to a bug.
	 *
	 * @param player - The player to remove.
	 * @param code - The reason the player was removed.
	 */
	public removeForBug(player: Player, code: KickCode): void {
		this.logger.Warn(`Kicking player ${player.Name} for bug: ${code}`);
		player.Kick(code);
	}
}
