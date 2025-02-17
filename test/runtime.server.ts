import { runCLI } from "@rbxts/jest";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";

import { config } from "./jest.config";

const [success, result] = runCLI(script, { verbose: config.verbose }, [
	ServerScriptService.FindFirstChild("TS")!.FindFirstChild("__test__")!,
	ReplicatedStorage.FindFirstChild("TS")!.FindFirstChild("__test__")!,
]).await();

if (!success) {
	throw `Failed to run test: ${result}`;
}
