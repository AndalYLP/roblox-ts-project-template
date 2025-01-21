export interface PlayerBalance {
	currency: number;
}

export const defaultPlayerBalance: PlayerBalance = {
	currency: 0,
};

export type PlayerBalanceType = keyof PlayerBalance;
