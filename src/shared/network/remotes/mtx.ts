import type { GamePass } from "types/enum/mtx";

export interface MtxClientToServerEvents {
	/**
	 * Sets the active state of a game pass, which is used to determine if a
	 * game pass is "on" for a player. E.g. If a player has a game pass for
	 * toggling increased walk speed, this would be used to turn that on or
	 * off.
	 *
	 * @param gamePass - The game pass to set the active state of.
	 * @param active - The active state to set the game pass to.
	 */
	setGamePassActive: (gamePass: GamePass, active: boolean) => void;
}

export interface MtxClientToServerFunctions {
	/** This is just an example. */
	example: () => void;
}
