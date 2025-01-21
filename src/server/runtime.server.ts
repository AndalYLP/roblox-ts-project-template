import { Flamework, Modding } from "@flamework/core";
import type Abbreviator from "@rbxts/abbreviate";
import type { Logger } from "@rbxts/log";
import Log from "@rbxts/log";

import { setupAbbreviator } from "shared/functions/abbreviator";
import { setupLogger } from "shared/functions/logger";

function start(): void {
	const abbreviator = setupAbbreviator();
	setupLogger();

	Modding.registerDependency<Logger>(ctor => Log.ForContext(ctor));
	Modding.registerDependency<Abbreviator>(() => abbreviator);

	Flamework.addPaths("src/server/services");
	Flamework.addPaths("src/server/decorators");

	Log.Info("Starting Flamework...");
	Flamework.ignite();
}

start();
