import type { Logger } from "@rbxts/log";

import { GamePassStatusChanged, MtxEvents } from "server/services/mtx";
import type { PlayerEntity } from "server/services/player/entity";
import { gamePass } from "types/enum/mtx";

@MtxEvents()
export class GamePassEventsService {
	constructor(private readonly logger: Logger) {}

	@GamePassStatusChanged(gamePass.Example)
	public exampleGamePass(playerEntity: PlayerEntity, isActive: boolean): void {
		if (isActive) {
			this.logger.Debug(`${playerEntity.Name} has activated example game pass!`);
		}
	}
}
