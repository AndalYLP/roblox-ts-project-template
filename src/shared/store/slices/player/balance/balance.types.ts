export interface PlayerBalance {
	currency: number;
}

export const defaultPlayerBalance: Readonly<PlayerBalance> = {
	currency: 0,
};

export type PlayerBalanceType = keyof PlayerBalance;
