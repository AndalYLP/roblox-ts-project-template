import type { CenturionClient } from "@rbxts/centurion";
import { Centurion } from "@rbxts/centurion";
import { CenturionUI } from "@rbxts/centurion-ui";
import { ReplicatedStorage } from "@rbxts/services";

const replicatedCenturion = ReplicatedStorage.TS.centurion;

function startCenturionUI(centurion: CenturionClient): void {
	CenturionUI.start(centurion, {
		activationKeys: [Enum.KeyCode.F2],
	});
}

export async function startCenturion(): Promise<void> {
	const client = Centurion.client();

	client.registry.load(replicatedCenturion.types);

	return client.start().then(value => {
		startCenturionUI(client);
		return value;
	});
}
