/** @see https://github.com/boatbomber/3D-Sound-Emulation/blob/master/README.md */
declare namespace SoundSystem {
	/**
	 * Attaches a sound to the sound system.
	 *
	 * @param soundObject - The sound instance.
	 */
	export function Attach(soundObject: Sound): void;

	/**
	 * Creates a new Attachment that holds a Sound, positioned at the specified
	 * target. The sound will play based on the target's location, and you can
	 * optionally loop it. If `looped` is false, the Attachment will be
	 * automatically deleted after the sound finishes playing.
	 *
	 * @param id - The unique ID of the sound. This is the ID from Roblox's
	 *   sound library.
	 * @param target - The target position or object to which the sound will be
	 *   attached. Can be:
	 *
	 *   - `CFrame`: The position and orientation of the attachment in 3D space.
	 *   - `Vector3`: A specific point in 3D space.
	 *   - `Instance`: A target object, where the sound will be attached.
	 *
	 * @param looped - A boolean indicating if the sound should loop. Default is
	 *   false. If false, the attachment will be automatically destroyed once
	 *   the sound finishes playing.
	 * @returns An object containing the `Sound` instance and the `Attachment`.
	 *
	 *   - `Sound`: The sound instance that has been created.
	 *   - `Attachment`: The created attachment object.
	 */
	export function Create(
		id: string,
		target: CFrame | Instance | Vector3,
		looped?: boolean,
	): { Sound: Sound } & Attachment;
}

export = SoundSystem;
