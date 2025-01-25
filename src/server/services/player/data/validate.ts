import { Flamework } from "@flamework/core";

import type { PlayerData } from "shared/store/slices/player";

export const validate = Flamework.createGuard<PlayerData>();
