import { createProducer } from "@rbxts/reflex";
import { withMultiplayer } from "shared/functions/withMultiplayer";
import { PlayerData } from "../../player.types";
import { PlayerSettings } from "../settings.types";
import { defaultPlayerAudioSettings, PlayerAudioSettings } from "./audio.types";

export type AudioState = Readonly<PlayerAudioSettings>;

const initialState: AudioState = defaultPlayerAudioSettings;

export const audioSlice = createProducer(initialState, {
	/**
	 * Updates a specific player's settings by modifying the given setting type.
	 * @param state The current state
	 * @param _settingCategory The setting category
	 * @param settingType The setting type
	 * @param value The new value
	 * @returns The new state
	 */
	changeSetting: (
		state,
		_settingCategory: keyof PlayerSettings, // Used to enable auto-completion for settingType based on the selected category
		settingType: keyof PlayerSettings[keyof PlayerSettings],
		value: PlayerSettings[keyof PlayerSettings][keyof PlayerSettings[keyof PlayerSettings]]
	): AudioState => ({
		...state,
		[settingType]: value
	}),

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): AudioState => data.settings.audio
}).enhance(withMultiplayer);
