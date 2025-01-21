import { Flamework, Modding } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import Log from "@rbxts/log";

import { setupLogger } from "shared/functions/logger";

import { createApp, reactConfig } from "./ui/app/config";

function start(): void {
	reactConfig();
	setupLogger();

	Modding.registerDependency<Logger>(ctor => Log.ForContext(ctor));

	Flamework.addPaths("src/client/controllers");

	Log.Info("Starting Flamework...");
	Flamework.ignite();

	createApp().catch(() => {
		Log.Fatal(`Failed to create React app!`);
	});
}

start();
