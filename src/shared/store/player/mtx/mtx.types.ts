import { GamePass, GamePassData, Product, ProductData } from "types/enum/mtx";

export interface PlayerMtx {
	readonly gamePasses: Map<GamePass, GamePassData>;
	readonly products: Map<Product, ProductData>;
	readonly receiptHistory: Array<string>;
}

export const defaultPlayerMtx: PlayerMtx = {
	gamePasses: new Map<GamePass, GamePassData>(),
	products: new Map<Product, ProductData>(),
	receiptHistory: []
};

export type PlayerMtxType = keyof PlayerMtx;
