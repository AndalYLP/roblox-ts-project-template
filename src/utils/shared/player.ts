import { Players } from "@rbxts/services";
import { EvaluateInstanceTree } from "@rbxts/validate-tree";

export const CHARACTER_LOAD_TIMEOUT = 10;

export type CharacterRig = EvaluateInstanceTree<typeof characterSchema>;

export const characterSchema = {
	$className: "Model",
	Head: "MeshPart",
	Humanoid: {
		$className: "Humanoid",
		Animator: "Animator"
	},
	HumanoidRootPart: "BasePart"
} as const;

/**
 * Function that listens for when a player is added and calls the callback
 * with te player. it also calls the callback for all existing players
 * @param callback The callback to run when a player is added
 * @returns A function to disconnect the connection
 */
export function onPlayerAdded(callback: (player: Player) => void): () => void {
	const connection = Players.PlayerAdded.Connect(callback);

	for (const player of Players.GetPlayers()) {
		callback(player);
	}

	return () => connection.Disconnect();
}

/**
 * Registers a callback function to be called when a player's character is
 * added.
 * @param player - The player whose character is being monitored.
 * @param callback - The callback function to be called when the character is
 *   added. It receives the character's rig as a parameter.
 * @returns A function that can be called to disconnect the callback from the
 *   event.
 */
export function onCharacterAdded(player: Player, callback: (rig: Model) => void): () => void {
	if (player.Character) {
		callback(player.Character);
	}

	const connection = player.CharacterAdded.Connect(callback);

	return () => connection.Disconnect();
}

/**
 * Returns a promise that resolves when the specified player is disconnected. If
 * the player is not a descendant of the Players service, the promise will
 * immediately resolve.
 * @param player - The player to wait for disconnection.
 * @returns A promise that resolves when the player is disconnected.
 */
export async function promisePlayerDisconnected(player: Player): Promise<void> {
	if (!player.IsDescendantOf(Players)) {
		return;
	}

	await Promise.fromEvent(Players.PlayerRemoving, (playerWhoLeft) => playerWhoLeft === player);
}

/**
 * Destroys the player's character model, ensuring that there is no memory leak.
 * @param player - The player whose character model to destroy.
 * @see https://twitter.com/mrchickenrocket/status/1699005062360789405?s=46
 */
export function cleanupCharacter(player: Player): void {
	if (!player.Character) {
		return;
	}

	player.Character.Destroy();
	player.Character = undefined;
}

/**
 * Attempts to load the player's character model. If the character model fails
 * to load within 10 seconds, the promise will still resolve.
 *
 * `LoadCharacter` is a Roblox API call that is prone to failure and can end up
 * yielding forever. This function is a workaround to that issue.
 * @param player - The player whose character model to load.
 * @see character-service.ts which handles retries
 */
export async function loadCharacter(player: Player): Promise<void> {
	await Promise.race<unknown>([
		Promise.try(() => {
			cleanupCharacter(player);
			player.LoadCharacter();
		}),
		Promise.delay(CHARACTER_LOAD_TIMEOUT)
	]);
}
