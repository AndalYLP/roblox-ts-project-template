import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { setTimeout } from "@rbxts/set-timeout";
import Signal from "@rbxts/signal";
import { promiseTree } from "@rbxts/validate-tree";
import { ListenerData, setupLifecycle } from "@utils/flamework";
import { CHARACTER_LOAD_TIMEOUT, CharacterRig, characterSchema, onCharacterAdded } from "@utils/player";
import { LocalPlayer } from "client/constants/player";

export interface OnCharacterAdded {
	/** Fires when the character is added to the game. */
	onCharacterAdded(character: CharacterRig): void;
}

export interface OnCharacterRemoved {
	/** Fires when the character is added to the game. */
	onCharacterRemoved(): void;
}

/**
 * A controller for managing the current character rig in the game. We verify
 * that the character rig is loaded and fully exists according to the schema
 * before we allow any other systems to interact with it. It is advised to use
 * this controller when interacting with specific parts of the character rig,
 * rather than directly accessing the character model through
 * `player.Character`.
 */
@Controller()
export class CharacterController implements OnStart {
	private currentCharacter?: CharacterRig;

	private readonly characterAddedEvents = new Array<ListenerData<OnCharacterAdded>>();
	private readonly characterRemovedEvents = new Array<ListenerData<OnCharacterRemoved>>();
	public readonly onCharacterAdded = new Signal<(character: CharacterRig) => void>();
	public readonly onCharacterRemoving = new Signal();

	constructor(private readonly logger: Logger) {}

	/**
	 * Gets the current character for the local player. This is the character
	 * that has been loaded and exists according to the character schema.
	 * @returns The current character rig if it exists.
	 */
	public getCurrentCharacter(): CharacterRig | undefined {
		return this.currentCharacter;
	}

	/**
	 * Ensures that a character model is loaded and exists according to the
	 * schema. If the character model is removed before it loads, or if it fails
	 * to load within the timeout, the promise will reject.
	 * @param model - The model to load the character rig from.
	 * @returns A promise that resolves when the character rig is loaded.
	 */
	private async characterAdded(model: Model): Promise<void> {
		const promise = promiseTree(model, characterSchema);

		const timeout = setTimeout(() => {
			promise.cancel();
		}, CHARACTER_LOAD_TIMEOUT);

		const connection = model.AncestryChanged.Connect(() => {
			if (model.IsDescendantOf(game)) return;

			promise.cancel();
		});

		const [success, rig] = promise.await();
		timeout();
		connection.Disconnect();

		if (!success) throw "Character failed to load.";

		this.listenForCharacterRemoving(model);
		this.onRigLoaded(rig);
	}

	/**
	 * Listens for the character model to be removed from the game.
	 * @param character - The character model to listen for removal on.
	 */
	private listenForCharacterRemoving(character: Model): void {
		const connection = character.AncestryChanged.Connect(() => {
			if (character.IsDescendantOf(game)) {
				return;
			}

			this.logger.Verbose(`Character has been removed.`);

			connection.Disconnect();
			this.removeCharacter();
			this.onCharacterRemoving.Fire();
		});
	}

	/**
	 * Called when the character rig has been fully loaded.
	 * @param rig - The character rig that was loaded.
	 */
	private onRigLoaded(rig: CharacterRig): void {
		this.logger.Debug(`Loaded character rig.`);
		this.currentCharacter = rig;

		for (const { id, event } of this.characterAddedEvents) {
			Promise.defer(() => {
				event.onCharacterAdded(rig);
			}).catch((e) => {
				this.logger.Error(`Error in character lifecycle ${id}: ${e}`);
			});
		}

		this.onCharacterAdded.Fire(rig);
	}

	private removeCharacter(): void {
		this.currentCharacter = undefined;

		for (const { id, event } of this.characterRemovedEvents) {
			Promise.defer(() => {
				event.onCharacterRemoved();
			}).catch((e) => {
				this.logger.Error(`Error in character lifecycle ${id}: ${e}`);
			});
		}
	}

	/** @ignore */
	public onStart(): void {
		setupLifecycle<OnCharacterAdded>(this.characterAddedEvents);
		setupLifecycle<OnCharacterRemoved>(this.characterRemovedEvents);

		onCharacterAdded(LocalPlayer, (character) => {
			this.characterAdded(character).catch((e) => {
				this.logger.Fatal(`Could not get character rig because:\n${e}`);
			});
		});
	}
}
