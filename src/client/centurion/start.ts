import { Centurion } from "@rbxts/centurion";
import { ReplicatedStorage } from "@rbxts/services";

const replicatedCenturion = ReplicatedStorage.TS.centurion;

export async function startCenturion(): Promise<void> {
	const client = Centurion.client();

	client.registry.load(replicatedCenturion.types);

	return client.start();
}
