import { Centurion } from "@rbxts/centurion";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";

const { centurion } = ServerScriptService.TS;
const replicatedCenturion = ReplicatedStorage.TS.centurion;

export async function startCenturion(): Promise<void> {
	const server = Centurion.server();

	server.registry.load(centurion.commands);
	server.registry.load(replicatedCenturion.types);

	server.start();
}
