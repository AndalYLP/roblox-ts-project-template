import { Flamework, Modding } from "@flamework/core";
import type Abbreviator from "@rbxts/abbreviate";
import type { Logger } from "@rbxts/log";
import Log from "@rbxts/log";

import { setupAbbreviator } from "shared/functions/abbreviator";
import { setupLogger } from "shared/functions/logger";

import { middleWares, store } from "./store";
import { broadcasterMiddleware } from "./store/middleware/broadcaster";

function start(): void {
	setupLogger();
	const abbreviator = setupAbbreviator();

	Log.Info("Applying store middlewares...");
	store.applyMiddleware(broadcasterMiddleware(), ...middleWares);

	Modding.registerDependency<Logger>(ctor => Log.ForContext(ctor));
	Modding.registerDependency<Abbreviator>(() => abbreviator);

	Flamework.addPaths("src/server/services");
	Flamework.addPaths("src/server/components");
	Flamework.addPaths("src/shared/components");

	Log.Info("Starting Flamework...");
	Flamework.ignite();
}

start();
