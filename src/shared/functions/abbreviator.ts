import Abbreviator from "@rbxts/abbreviate";

/**
 * Sets up the abbreviator for the application, for both the client and server.
 *
 * @returns - The abbreviator instance.
 */
export function setupAbbreviator(): Abbreviator {
	const abbreviator = new Abbreviator();

	abbreviator.setSetting("stripTrailingZeroes", true);
	return abbreviator;
}
