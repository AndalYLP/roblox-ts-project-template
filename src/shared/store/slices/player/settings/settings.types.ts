import type { PlayerAudioSettings } from "./audio/audio.types";
import { defaultPlayerAudioSettings } from "./audio/audio.types";

export interface PlayerSettings {
	readonly audio: PlayerAudioSettings;
}

export const defaultPlayerSettings: Readonly<PlayerSettings> = {
	audio: defaultPlayerAudioSettings,
};
