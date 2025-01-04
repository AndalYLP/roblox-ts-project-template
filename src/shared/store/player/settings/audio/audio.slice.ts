import { createProducer } from "@rbxts/reflex";
import { PlayerData } from "../../player.types";
import { PlayerSettings } from "../settings.types";
import { PlayerAudioSettings } from "./audio.types";

export type AudioState = Readonly<Record<string, PlayerAudioSettings | undefined>>;

const initialState: AudioState = {};

export const audioSlice = createProducer(initialState, {
	/**
	 * Updates a specific player's settings by modifying the given setting type.
	 * @param state The current state
	 * @param player The player to update the setting
	 * @param settingCategory The setting category
	 * @param settingType The setting type
	 * @param value The new value
	 * @returns The new state
	 */
	changeSetting: (
		state,
		player: string,
		settingCategory: keyof PlayerSettings, // Used to enable auto-completion for settingType based on the selected category
		settingType: keyof PlayerSettings[keyof PlayerSettings],
		value: PlayerSettings[keyof PlayerSettings][keyof PlayerSettings[keyof PlayerSettings]]
	): AudioState => {
		const setting = state[player];
		print(setting);

		return {
			...state,
			[player]: setting && {
				...setting,
				[settingType]: value
			}
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData): AudioState => ({
		...state,
		[player]: data.settings.audio
	}),

	/** @ignore */
	closePlayerData: (state, player: string): AudioState => ({
		...state,
		[player]: undefined
	})
});
