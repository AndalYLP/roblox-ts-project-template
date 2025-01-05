import { Controller, OnInit, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Make from "@rbxts/make";
import { Inspect } from "@rbxts/rbx-debug";
import { SoundService, TweenService } from "@rbxts/services";
import { LocalPlayer } from "client/constants/player";
import { store } from "client/store";
import { SoundSystem } from "shared/modules/3dSound";
import { PlayerSettings, selectPlayerSettingsData } from "shared/store/player/settings";

export const enum SoundType {
	Music = "Music",
	SoundEffect = "SoundEffect"
}

interface PlaySoundOptions {
	attachToPoint?: BasePart;
	debugName?: string;
	sound: number;
	soundProperties?: Omit<Partial<InstanceProperties<Sound>>, "Parent">;
	soundType: SoundType;
}

@Controller()
export class AudioController implements OnInit, OnStart {
	private readonly soundGroups = new Map<SoundType, SoundGroup>();

	constructor(private readonly logger: Logger) {}

	public createSound({ attachToPoint, debugName, sound, soundProperties = {}, soundType }: PlaySoundOptions): Sound {
		const soundGroup = this.soundGroups.get(soundType);
		assert(soundGroup, `SoundGroup not found for SoundType ${soundType}`);

		const soundParent = attachToPoint ?? soundGroup;
		const soundObject = Make("Sound", {
			...soundProperties,
			Name: debugName ?? Inspect(sound),
			Parent: soundParent,
			SoundGroup: soundGroup,
			SoundId: `rbxassetid://${sound}`
		});

		if (attachToPoint) SoundSystem.attach(soundObject);

		this.logger.Info(`Playing sound ${sound} of type ${soundType}`);

		return soundObject;
	}

	/**
	 * Play a sound!
	 * @param soundObject The sound's instance to play.
	 * @param fadeInTime The fade time.
	 */
	public play(soundObject: Sound, fadeInTime?: number): void {
		soundObject.Play();

		if (fadeInTime !== undefined) {
			this.fadeInSound(soundObject, fadeInTime);
		}
	}

	/**
	 * Don't use directly, it won't play the sound, use `AudioController.play` with `fadeInTime` instead.
	 * @param soundObject The sound's instance.
	 * @param fadeInTime The fade time.
	 */
	public fadeInSound(soundObject: Sound, fadeInTime: number): void {
		const desiredVolume = soundObject.Volume;
		soundObject.Volume = 0;

		const tweenInfo = new TweenInfo(fadeInTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

		TweenService.Create(soundObject, tweenInfo, { Volume: desiredVolume }).Play();
	}

	private makeSoundGroup(soundType: SoundType): SoundGroup {
		const existing = SoundService.FindFirstChild(soundType);
		if (existing?.IsA("SoundGroup") === true) return existing;

		return Make("SoundGroup", {
			Name: soundType,
			Parent: SoundService,
			Volume: 1
		});
	}

	private onSettingsChanged(current: PlayerSettings): void {
		const musicGroup = this.soundGroups.get(SoundType.Music);
		assert(musicGroup, `Music SoundGroup not found`);
		musicGroup.Volume = current.audio.musicVolume;

		const sfxGroup = this.soundGroups.get(SoundType.SoundEffect);
		assert(sfxGroup, `SoundEffect SoundGroup not found`);
		sfxGroup.Volume = current.audio.sfxVolume;
	}

	/** @ignore */
	public onInit(): void {
		this.soundGroups.set(SoundType.Music, this.makeSoundGroup(SoundType.Music));
		this.soundGroups.set(SoundType.SoundEffect, this.makeSoundGroup(SoundType.SoundEffect));

		this.logger.Info(`Setup SoundGroup instances`);
	}

	/** @ignore */
	public onStart(): void {
		store.subscribe(selectPlayerSettingsData(LocalPlayer), (current) => {
			if (!current) return;

			this.onSettingsChanged(current);
		});
	}
}
