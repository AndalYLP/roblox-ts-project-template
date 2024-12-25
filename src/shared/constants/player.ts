import { Players } from "@rbxts/services";

const { LocalPlayer } = Players;

export const USER_ID = LocalPlayer ? tostring(LocalPlayer.UserId) : "0";
export const USER_NAME = LocalPlayer ? LocalPlayer.Name : "(server)";
