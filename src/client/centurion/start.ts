import { Centurion } from "@rbxts/centurion";

export async function startCenturion(): Promise<void> {
	const client = Centurion.client();

	return client.start();
}
