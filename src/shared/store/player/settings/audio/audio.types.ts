export interface PlayerAudioSettings {
	readonly musicVolume: number;
	readonly sfxVolume: number;
}

export const defaultPlayerAudioSettings: PlayerAudioSettings = {
	musicVolume: 1,
	sfxVolume: 1
};

export type PlayerAudioSettingsType = keyof PlayerAudioSettings;
