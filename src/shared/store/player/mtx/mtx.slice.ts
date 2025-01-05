import { createProducer } from "@rbxts/reflex";
import { GamePass, Product } from "types/enum/mtx";
import { PlayerData } from "../player.types";
import { defaultPlayerMtx, PlayerMtx } from "./mtx.types";

export type MtxState = Readonly<PlayerMtx>;

const initialState: MtxState = defaultPlayerMtx;

export const mtxSlice = createProducer(initialState, {
	/** @ignore */
	purchaseDeveloperProduct: (state, productId: Product, currencySpent: number): MtxState => {
		const purchaseInfo = {
			purchasePrice: currencySpent,
			purchaseTime: os.time()
		};

		return {
			...state,
			products: new Map([...state.products]).set(productId, {
				purchaseInfo: [...(state.products.get(productId)?.purchaseInfo ?? []), purchaseInfo],
				timesPurchased: (state.products.get(productId)?.timesPurchased ?? 0) + 1
			})
		};
	},

	/** @ignore */
	purchaseGamePass: (state, gamePassId: GamePass): MtxState => ({
		...state,
		gamePasses: new Map([...state.gamePasses]).set(gamePassId, {
			active: true
		})
	}),

	/** @ignore */
	setGamePassActive: (state, gamePass: GamePass, active: boolean): MtxState => ({
		...state,
		gamePasses: new Map([...state.gamePasses]).set(gamePass, {
			active
		})
	}),

	/** @ignore */
	updateReceiptHistory: (state, receiptHistory: Array<string>): MtxState => ({
		...state,
		receiptHistory
	}),

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): MtxState => data.mtx
});
