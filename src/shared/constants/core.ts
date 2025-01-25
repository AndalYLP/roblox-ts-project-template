import { RunService } from "@rbxts/services";
import Signal from "@rbxts/signal";

import { $NODE_ENV } from "rbxts-transform-env";

/** Game's name, `//NOTE:` define before use. */
export const GAME_NAME = "Template for roblox-ts";
/**
 * Indicates whether the environment is production, based on the `NODE_ENV`
 * environment variable.
 */
export const IS_PROD = $NODE_ENV === "production";
/**
 * Indicates whether the environment is development, based on the `NODE_ENV`
 * environment variable.
 */
export const IS_DEV = $NODE_ENV === "development";
/** Indicates whether the current environment is running in Roblox Studio. */
export const IS_STUDIO = RunService.IsStudio();
/** Indicates where the current environment is studio and not running. */
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
/** Indicates whether the current environment is running on the client. */
export const IS_CLIENT = RunService.IsClient();
/** Same as game.PlaceId. */
export const PLACE_ID = game.PlaceId;
/** Fires when flamework gets ignited. */
export const FLAMEWORK_IGNITED = new Signal();
