/* eslint-disable ts/no-require-imports -- We can't use TS.import for this file since we use it to run tests with open cloud */

import type JestModule from "@rbxts/jest";

import type * as ConfigModule from "./jest.config";

const ReplicatedStorage = game.GetService("ReplicatedStorage");
const ServerScriptService = game.GetService("ServerScriptService");

const { config } = require(
	script.Parent!.FindFirstChild("jest.config") as ModuleScript,
) as typeof ConfigModule;

const jestLua = ReplicatedStorage.WaitForChild("rbxts_include")
	.FindFirstChild("node_modules")!
	.FindFirstChild("@rbxts")!
	.WaitForChild("JestLua");
const { runCLI } = require(
	(jestLua as { Jest: ModuleScript } & Instance).Jest,
) as typeof JestModule;

const [success, result] = runCLI(script, config, [
	ServerScriptService.FindFirstChild("TS")!.FindFirstChild("__test__")!,
	ReplicatedStorage.FindFirstChild("TS")!.FindFirstChild("__test__")!,
]).await();

if (!success) {
	throw `Failed to run test: ${result}`;
}
