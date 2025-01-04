import { Players } from "@rbxts/services";

export const { LocalPlayer } = Players;

/** The player's GUI instance */
export const PLAYER_GUI = LocalPlayer.FindFirstChildWhichIsA("PlayerGui")!;
