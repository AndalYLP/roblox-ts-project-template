import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { setupLogger } from "shared/functions/logger";

function start(): void {
	setupLogger();

	Modding.registerDependency<Logger>((ctor) => Log.ForContext(ctor));

	Flamework.addPaths("src/client/controllers");

	Log.Info("Starting Flamework...");
	Flamework.ignite();
}

start();
