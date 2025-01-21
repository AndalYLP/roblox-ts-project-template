import { Flamework, Modding } from "@flamework/core";
import type Abbreviator from "@rbxts/abbreviate";
import type { Logger } from "@rbxts/log";
import Log from "@rbxts/log";

import { setupAbbreviator } from "shared/functions/abbreviator";
import { setupLogger } from "shared/functions/logger";

import { createApp, reactConfig } from "./ui/app/config";

function start(): void {
	setupLogger();
	reactConfig();
	const abbreviator = setupAbbreviator();

	Modding.registerDependency<Logger>(ctor => Log.ForContext(ctor));
	Modding.registerDependency<Abbreviator>(() => abbreviator);

	Flamework.addPaths("src/client/controllers");

	Log.Info("Starting Flamework...");
	Flamework.ignite();

	createApp().catch(() => {
		Log.Fatal(`Failed to create React app!`);
	});
}

start();
