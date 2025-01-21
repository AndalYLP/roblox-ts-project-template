import { Flamework } from "@flamework/core";

import type { PlayerData } from "shared/store/player";

export const validate = Flamework.createGuard<PlayerData>();
