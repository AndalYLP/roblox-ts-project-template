import { runCLI } from "@rbxts/jest";
import { ServerScriptService } from "@rbxts/services";

import { config } from "./jest.config";

const [success, result] = runCLI(script, { verbose: config.verbose }, [
	ServerScriptService,
]).await();

if (!success) {
	throw `Failed to run test: ${result}`;
}
