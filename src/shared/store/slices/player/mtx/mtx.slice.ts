import { createProducer } from "@rbxts/reflex";

import type { PlayerMtx } from "shared/store/slices/player/mtx/mtx.types";
import { defaultPlayerMtx } from "shared/store/slices/player/mtx/mtx.types";
import type { PlayerData } from "shared/store/slices/player/player.types";
import type { GamePass, Product } from "types/enum/mtx";

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
