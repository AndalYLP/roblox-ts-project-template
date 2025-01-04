import { Flamework } from "@flamework/core";
import { PlayerData } from "shared/store/player";

export const validate = Flamework.createGuard<PlayerData>();
