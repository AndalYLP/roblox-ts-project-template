import Log from "@rbxts/log";

import { IS_DEV } from "shared/constants/core";
import { globalEvents, globalFunctions } from "shared/network";

export const events = globalEvents.createClient({
	warnOnInvalidGuards: IS_DEV,
});
export const functions = globalFunctions.createClient({
	warnOnInvalidGuards: IS_DEV,
});

if (IS_DEV) {
	globalEvents.registerHandler("onBadRequest", (player, message) => {
		Log.Warn(`Bad request from ${player.UserId}: ${message}`);
	});

	globalFunctions.registerHandler("onBadResponse", (player, message) => {
		Log.Warn(`Bad response from ${player.UserId}: ${message}`);
	});
}
