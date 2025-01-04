import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { setTimeout } from "@rbxts/set-timeout";
import { promiseTree } from "@rbxts/validate-tree";
import { ListenerData, setupLifecycle } from "@utils/flamework";
import { addToCollisionGroup } from "@utils/physics";
import { CHARACTER_LOAD_TIMEOUT, CharacterRig, characterSchema, loadCharacter, onCharacterAdded } from "@utils/player";
import { CollisionGroup } from "types/enum/collision-group";
import { Tag } from "types/enum/tag";
import { OnPlayerJoin } from "..";
import { PlayerEntity } from "../entity";

export interface OnCharacterAdded {
	/** Fires when a character is added to the game. */
	onCharacterAdded(character: CharacterRig, playerEntity: PlayerEntity): void;
}

export interface OnCharacterRemoved {
	/** Fires when a character is removed from the game, and after character added. */
	onCharacterRemoved(playerEntity: PlayerEntity): void;
}

@Service()
export class CharacterService implements OnStart, OnPlayerJoin {
	private readonly characterAddedEvents = new Array<ListenerData<OnCharacterAdded>>();
	private readonly characterRemovedEvents = new Array<ListenerData<OnCharacterRemoved>>();
	private readonly characterRigs = new Map<Player, CharacterRig>();

	constructor(private readonly logger: Logger) {}

	/**
	 * Returns the character rig associated with the given player, if it exists.
	 * @param player - The player whose character rig to retrieve.
	 * @returns The character rig associated with the player, or undefined if it
	 *   does not exist.
	 */
	public getCharacterRig(player: Player): CharacterRig | undefined {
		return this.characterRigs.get(player);
	}

	/**
	 * This method wraps a callback and replaces the first argument (that must
	 * be of type `Player`) with that players `character rig`.
	 * @param callback The callback to wrap.
	 * @returns A new callback that replaces the first argument with the
	 *   player's character rig.
	 */
	public withPlayerRig<T extends Array<unknown>, R = void>(callback: (playerRig: CharacterRig, ...args: T) => R) {
		return (player: Player, ...args: T): R | undefined => {
			const playerRig = this.getCharacterRig(player);
			if (!playerRig) {
				this.logger.Info(`Could not get character rig for ${player.UserId}`);
				return;
			}

			return callback(playerRig, ...args);
		};
	}

	/**
	 * Called internally when a character is added to the game.
	 * @param playerEntity the player's entity.
	 * @param character the player's character.
	 */
	private async characterAdded(playerEntity: PlayerEntity, character: Model): Promise<void> {
		const promise = promiseTree(character, characterSchema);

		const { player } = playerEntity;

		const timeout = setTimeout(() => {
			promise.cancel();
			return this.retryCharacterLoad(player);
		}, CHARACTER_LOAD_TIMEOUT);

		const connection = character.AncestryChanged.Connect(() => {
			if (character.IsDescendantOf(game)) return;

			promise.cancel();
		});

		const [success, rig] = promise.await();
		timeout();
		connection.Disconnect();

		if (!success) throw `Could not get character rig for ${player.UserId}`;

		this.listenForCharacterRemoving(playerEntity, character);
		this.onRigLoaded(playerEntity, rig);
	}

	/**
	 * Listens for the character model to be removed from the game.
	 * @param playerEntity the player's entity
	 * @param character - The character model to listen for removal on.
	 */
	private listenForCharacterRemoving(playerEntity: PlayerEntity, character: Model): void {
		const connection = character.AncestryChanged.Connect(() => {
			if (character.IsDescendantOf(game)) {
				return;
			}

			connection.Disconnect();
			this.removeCharacter(playerEntity);
		});
	}

	private async characterAppearanceLoaded(player: Player, rig: CharacterRig): Promise<void> {
		if (!player.HasAppearanceLoaded()) {
			await Promise.fromEvent(player.CharacterAppearanceLoaded).timeout(CHARACTER_LOAD_TIMEOUT);
		}

		rig.Head.AddTag(Tag.PlayerHead);
	}

	/**
	 * Called when the character rig has been fully loaded.
	 * @param playerEntity The player's entity.
	 * @param rig - The character rig that was loaded.
	 */
	private onRigLoaded(playerEntity: PlayerEntity, rig: CharacterRig): void {
		const { player, UserId, janitor } = playerEntity;

		janitor.Add(addToCollisionGroup(rig, CollisionGroup.Character, true), true);
		rig.AddTag(Tag.PlayerCharacter);
		this.characterRigs.set(player, rig);

		debug.profilebegin("Lifecycle_Character_Added");
		{
			for (const { id, event } of this.characterAddedEvents) {
				janitor
					.AddPromise(
						Promise.defer(() => {
							debug.profilebegin(id);
							event.onCharacterAdded(rig, playerEntity);
						})
					)
					.catch((e) => {
						this.logger.Error(`Error in character lifecycle ${id}: ${e}`);
					});
			}
		}
		debug.profileend();

		janitor.AddPromise(this.characterAppearanceLoaded(player, rig)).catch((e) => {
			this.logger.Info(`Character appearance did not load for ${UserId}, with reason: ${e}`);
		});
	}

	private removeCharacter(playerEntity: PlayerEntity): void {
		const { player, janitor } = playerEntity;

		this.characterRigs.delete(player);
		for (const { id, event } of this.characterRemovedEvents) {
			janitor
				.AddPromise(
					Promise.defer(() => {
						event.onCharacterRemoved(playerEntity);
					})
				)
				.catch((e) => {
					this.logger.Error(`Error in character lifecycle ${id}: ${e}`);
				});
		}
	}

	private async retryCharacterLoad(player: Player): Promise<void> {
		this.logger.Warn(`Getting full rig for ${player.UserId} timed out. Retrying...`);
		return loadCharacter(player);
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { janitor, player } = playerEntity;

		janitor.Add(
			onCharacterAdded(player, (character) => {
				janitor.AddPromise(this.characterAdded(playerEntity, character)).catch((e) => {
					this.logger.Fatal(`Could not get character rig because:\n${e}`);
				});
			})
		);
	}

	/** @ignore */
	public onStart(): void {
		setupLifecycle<OnCharacterAdded>(this.characterAddedEvents);
		setupLifecycle<OnCharacterRemoved>(this.characterRemovedEvents);
	}
}
