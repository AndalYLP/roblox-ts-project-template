import { TransformResult, TypeBuilder } from "@rbxts/centurion";
import { Players } from "@rbxts/services";

export const username = TypeBuilder.create<number>("Username")
	.transform(name => {
		try {
			const userId = Players.GetUserIdFromNameAsync(name);

			return TransformResult.ok(userId);
		} catch (err) {
			return TransformResult.err(`Error getting userId: ${err}`);
		}
	}, true)
	.suggestions(() => Players.GetPlayers().map(player => player.Name))
	.markForRegistration()
	.build();
