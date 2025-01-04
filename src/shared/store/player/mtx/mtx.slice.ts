import { createProducer } from "@rbxts/reflex";
import { GamePass, Product } from "types/enum/mtx";
import { PlayerMtx } from ".";
import { PlayerData } from "../player.types";

export type MtxState = Readonly<Record<string, PlayerMtx | undefined>>;

const initialState: MtxState = {};

export const mtxSlice = createProducer(initialState, {
	/** @ignore */
	purchaseDeveloperProduct: (state, player: string, productId: Product, currencySpent: number): MtxState => {
		const mtx = state[player];
		const purchaseInfo = {
			purchasePrice: currencySpent,
			purchaseTime: os.time()
		};

		return {
			...state,
			[player]: mtx && {
				...mtx,
				products: new Map([...mtx.products]).set(productId, {
					purchaseInfo: [...(mtx.products.get(productId)?.purchaseInfo ?? []), purchaseInfo],
					timesPurchased: (mtx.products.get(productId)?.timesPurchased ?? 0) + 1
				})
			}
		};
	},

	/** @ignore */
	purchaseGamePass: (state, player: string, gamePassId: GamePass): MtxState => {
		const mtx = state[player];

		return {
			...state,
			[player]: mtx && {
				...mtx,
				gamePasses: new Map([...mtx.gamePasses]).set(gamePassId, {
					active: true
				})
			}
		};
	},

	/** @ignore */
	setGamePassActive: (state, player: string, gamePass: GamePass, active: boolean): MtxState => {
		const mtx = state[player];

		return {
			...state,
			[player]: mtx && {
				...mtx,
				gamePasses: new Map([...mtx.gamePasses]).set(gamePass, {
					active
				})
			}
		};
	},

	/** @ignore */
	updateReceiptHistory: (state, player: string, receiptHistory: Array<string>): MtxState => {
		const mtx = state[player];

		return {
			...state,
			[player]: mtx && {
				...mtx,
				receiptHistory
			}
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData): MtxState => {
		return {
			...state,
			[player]: data.mtx
		};
	},

	/** @ignore */
	closePlayerData: (state, player: string): MtxState => {
		return {
			...state,
			[player]: undefined
		};
	}
});
