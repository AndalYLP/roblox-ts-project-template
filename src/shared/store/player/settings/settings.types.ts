import { defaultPlayerAudioSettings, PlayerAudioSettings } from "./audio";

export interface PlayerSettings {
	readonly audio: PlayerAudioSettings;
}

export const defaultPlayerSettings: PlayerSettings = {
	audio: defaultPlayerAudioSettings
};
