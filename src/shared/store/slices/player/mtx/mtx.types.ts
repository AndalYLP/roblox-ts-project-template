import type { GamePass, GamePassData, Product, ProductData } from "types/enum/mtx";

export interface PlayerMtx {
	gamePasses: Map<GamePass, GamePassData>;
	products: Map<Product, ProductData>;
	receiptHistory: Array<string>;
}

export const defaultPlayerMtx: Readonly<PlayerMtx> = {
	gamePasses: new Map<GamePass, GamePassData>(),
	products: new Map<Product, ProductData>(),
	receiptHistory: [],
};

export type PlayerMtxType = keyof PlayerMtx;
