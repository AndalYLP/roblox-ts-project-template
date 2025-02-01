export interface PlayerAudioSettings {
	musicVolume: number;
	sfxVolume: number;
}

export const defaultPlayerAudioSettings: Readonly<PlayerAudioSettings> = {
	musicVolume: 1,
	sfxVolume: 1,
};

export type PlayerAudioSettingsType = keyof PlayerAudioSettings;
