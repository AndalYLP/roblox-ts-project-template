import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";

import { gamePass } from "types/enum/mtx";

import { GamePassStatusChanged } from "../../decorators/mtx";
import type { PlayerEntity } from "../player/entity";

@Service()
export class GamePassEventsService {
	constructor(public readonly logger: Logger) {}

	@GamePassStatusChanged(gamePass.Example)
	public exampleGamePass(playerEntity: PlayerEntity, isActive: boolean): void {
		if (isActive) {
			this.logger.Debug(`${playerEntity.Name} has activated example game pass!`);
		}
	}
}
