import { RunService } from "@rbxts/services";

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
/**
 * This property describes the ID of the
 * [place](https://developer.roblox.com/en-us/articles/place) running on the
 * server.
 *
 * This ID corresponds with the number in the
 * [place's](https://developer.roblox.com/en-us/articles/place) URL. For
 * example, the ID of the place at the following URL is _1818_:>
 * [https://www.roblox.com/games/1818/Classic-Crossroads](https://www.roblox.com/games/1818/Classic-Crossroads).
 *
 * The place ID can also be found in the [Asset
 * Manager](https://developer.roblox.com/en-us/resources/studio/Asset-Manager)
 * in Roblox Studio by right clicking on the place inside of the
 * [Places](https://developer.roblox.com/en-us/resources/studio/Asset-Manager#places)
 * folder and selecting 'Copy ID to clipboard'.
 *
 * When using Roblox Studio, if the place has not been published to Roblox then
 * the PlaceId will correspond with the template being used.
 *
 * See also --------.
 *
 * [DataModel.GameId](https://developer.roblox.com/en-us/api-reference/property/DataModel/GameId),
 * which describes the ID of the
 * [game](https://developer.roblox.com/en-us/articles/multi-place-games) the
 * current [place](https://developer.roblox.com/en-us/articles/place) belongs to
 * [DataModel.JobId](https://developer.roblox.com/en-us/api-reference/property/DataModel/JobId),
 * which is a unique identifier for the server game instance running
 * [TeleportService](https://developer.roblox.com/en-us/api-reference/class/TeleportService),
 * which is a service that can be used to transport
 * [Players](https://developer.roblox.com/en-us/api-reference/class/Player)
 * between places.
 *
 * Tags: NotReplicated.
 */
export const PLACE_ID = game.PlaceId;
