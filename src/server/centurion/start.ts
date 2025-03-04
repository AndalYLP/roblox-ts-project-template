import { Centurion } from "@rbxts/centurion";
import { ReplicatedStorage } from "@rbxts/services";

const centurion = script.Parent as ServerScriptService["TS"]["centurion"];
const replicatedCenturion = ReplicatedStorage.TS.centurion;

export async function startCenturion(): Promise<void> {
	const server = Centurion.server();

	server.registry.load(centurion.commands);
	server.registry.load(replicatedCenturion.types);

	server.start();
}
