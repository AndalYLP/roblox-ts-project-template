import { createProducer } from "@rbxts/reflex";

import type { GamePass, Product } from "types/enum/mtx";

import type { PlayerData } from "../player.types";
import type { PlayerMtx } from "./mtx.types";
import { defaultPlayerMtx } from "./mtx.types";

export type MtxState = Readonly<PlayerMtx>;

const initialState: MtxState = defaultPlayerMtx;

export const mtxSlice = createProducer(initialState, {
	/** @ignore */
	purchaseDeveloperProduct: (state, productId: Product, currencySpent: number): MtxState => {
		const purchaseInfo = {
			purchasePrice: currencySpent,
			purchaseTime: os.time(),
		};

		return {
			...state,
			products: new Map([...state.products]).set(productId, {
				purchaseInfo: [
					...(state.products.get(productId)?.purchaseInfo ?? []),
					purchaseInfo,
				],
				timesPurchased: (state.products.get(productId)?.timesPurchased ?? 0) + 1,
			}),
		};
	},

	/** @ignore */
	purchaseGamePass: (state, gamePassId: GamePass): MtxState => {
		return {
			...state,
			gamePasses: new Map([...state.gamePasses]).set(gamePassId, {
				active: true,
			}),
		};
	},

	/** @ignore */
	setGamePassActive: (state, gamePass: GamePass, active: boolean): MtxState => {
		return {
			...state,
			gamePasses: new Map([...state.gamePasses]).set(gamePass, {
				active,
			}),
		};
	},

	/** @ignore */
	updateReceiptHistory: (state, receiptHistory: Array<string>): MtxState => {
		return {
			...state,
			receiptHistory,
		};
	},

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): MtxState => data.mtx,
});
