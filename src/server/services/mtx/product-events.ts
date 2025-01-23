import type { Logger } from "@rbxts/log";

import type { Product } from "types/enum/mtx";
import { product } from "types/enum/mtx";

import type { PlayerEntity } from "../player/entity";
import { MtxEvents, RegisterProductHandler } from ".";

@MtxEvents()
export class ProductEventsService {
	constructor(private readonly logger: Logger) {}

	@RegisterProductHandler(product.Example)
	public exampleProduct(playerEntity: PlayerEntity, productId: Product): boolean {
		this.logger.Debug(`Example product purchased! ${playerEntity.Name} bought ${productId}`);
		return true;
	}
}
