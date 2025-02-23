import type { Argv } from "@rbxts/jest/src/config";

export const config = {
	testMatch: ["**/*.spec"],
	verbose: true,
} satisfies Argv;
