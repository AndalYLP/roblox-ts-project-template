import { Players } from "@rbxts/services";

export const { LocalPlayer } = Players;

export const PLAYER_GUI = LocalPlayer.FindFirstChildWhichIsA("PlayerGui")!;
