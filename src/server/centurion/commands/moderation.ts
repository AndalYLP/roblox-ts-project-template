import type { CommandContext } from "@rbxts/centurion";
import { CenturionType, Command, Group, Register } from "@rbxts/centurion";
import { Players } from "@rbxts/services";

import { username } from "shared/centurion/types/username";

@Register({
	groups: [
		{
			name: "moderation",
			description: "Moderation related commands",
		},
	],
})
@Group("moderation")
export class ModerationCommand {
	@Command({
		name: "ban",
		arguments: [
			{
				name: "Username",
				description: "Player's username to ban from the game.",
				type: username.name,
			},
			{
				name: "Reason",
				description: "The reason to ban the player.",
				type: CenturionType.String,
			},
			{
				name: "Duration",
				description: "The duration of the ban.",
				type: CenturionType.Number,
			},
		],
	})
	public ban(
		commandContext: CommandContext,
		userId: number,
		reason: string,
		duration: number,
	): void {
		try {
			Players.BanAsync({
				DisplayReason: reason,
				Duration: duration,
				PrivateReason: reason,
				UserIds: [userId],
			});

			commandContext.reply(`Banned ${userId}.`);
		} catch (err) {
			commandContext.error(`Error banning user ${userId}: ${err}`);
		}
	}

	@Command({
		name: "kick",
		arguments: [
			{
				name: "Player",
				description: "Player to kick from the game.",
				type: CenturionType.Player,
			},
			{
				name: "Reason",
				description: "Reason of the kick.",
				optional: true,
				type: CenturionType.String,
			},
		],
	})
	public kick(commandContext: CommandContext, player: Player, reason?: string): void {
		try {
			player.Kick(reason);

			commandContext.reply(`Player ${player.UserId} kicked.`);
		} catch (err) {
			commandContext.error(`Error kicking player: ${err}`);
		}
	}
}
