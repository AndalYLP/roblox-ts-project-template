import { Centurion } from "@rbxts/centurion";

const centurion = script.Parent as ServerScriptService["centurion"];

export async function startCenturion(): Promise<void> {
	const server = Centurion.server();

	server.registry.load(centurion.commands);

	server.start();
}
