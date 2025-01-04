import { Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { RegisterProductHandler } from "server/decorators/mtx";
import { Product, product } from "types/enum/mtx";
import { PlayerEntity } from "../player/entity";

@Service()
export class ProductEventsService {
	constructor(private readonly logger: Logger) {}

	@RegisterProductHandler(product.Example)
	public exampleProduct(playerEntity: PlayerEntity, product: Product): boolean {
		this.logger.Debug(`Example product purchased! ${playerEntity.Name} bought ${product}`);
		return true;
	}
}
