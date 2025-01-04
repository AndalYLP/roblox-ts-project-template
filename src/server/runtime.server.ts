import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { setupLogger } from "shared/functions/logger";

function start(): void {
	setupLogger();

	Modding.registerDependency<Logger>((ctor) => Log.ForContext(ctor));

	Flamework.addPaths("src/server/services");
	Flamework.addPaths("src/server/decorators");

	Log.Info("Starting Flamework...");
	Flamework.ignite();
}

start();
