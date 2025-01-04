import { Players } from "@rbxts/services";

const { LocalPlayer } = Players;

/** The player's ID as a string, or `0` if it's required by the server. */
export const USER_ID = LocalPlayer ? tostring(LocalPlayer.UserId) : "0";
/** The player's name as a string, or `(server)` if it's required by the server. */
export const USER_NAME = LocalPlayer ? LocalPlayer.Name : "(server)";
