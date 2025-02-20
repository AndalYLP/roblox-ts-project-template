import type { Logger } from "@rbxts/log";

import { gamePass } from "types/enum/mtx";

import type { PlayerEntity } from "../../player/entity";
import { GamePassStatusChanged, MtxEvents } from "..";

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
