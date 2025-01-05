import { runCLI } from "@rbxts/jest";
import { ServerScriptService } from "@rbxts/services";

const [success, result] = runCLI(
	script,
	{
		verbose: false,
		ci: false,
		setupFiles: [script.Parent!.FindFirstChild("setup")! as ModuleScript]
	},
	[ServerScriptService.TS.FindFirstChild("__test__")!]
).awaitStatus();

if (!success) {
	error(`Failed to run test: ${result}`);
}
