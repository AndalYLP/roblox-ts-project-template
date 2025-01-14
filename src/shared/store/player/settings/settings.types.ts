import { defaultPlayerAudioSettings, PlayerAudioSettings } from "./audio/audio.types";

export interface PlayerSettings {
	readonly audio: PlayerAudioSettings;
}

export const defaultPlayerSettings: PlayerSettings = {
	audio: defaultPlayerAudioSettings
};
