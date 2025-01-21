import type { OnInit } from "@flamework/core";
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import { t } from "@rbxts/t";

import { store } from "server/store";
import type { PlayerData } from "shared/store/player";
import { selectPlayerData } from "shared/store/player";

import type { OnPlayerJoin, OnPlayerLeave } from ".";
import type { PlayerEntity } from "./entity";

interface LeaderstatValueTypes {
	IntValue: number;
	StringValue: string;
}

interface LeaderstatEntry<T extends keyof LeaderstatValueTypes = keyof LeaderstatValueTypes> {
	Name: Leaderstats;
	PlayerDataKey?: NestedKeyOf<PlayerData>;
	ValueType: T;
}

type Leaderstats = "Currency" | "Test";

type LeaderstatValue = Instances[keyof LeaderstatValueTypes];

/**
 * A service that initializes the Roblox leaderboard stats for the game.
 *
 * This service is responsible for initializing the leaderboard stats for the
 * game. It will bind the stats to the player's leaderstats folder and update
 * the values based on the player's data.
 *
 * Usage: Add the required stats in the `onInit` method, and add the data key to
 * bind to then `Leaderstats` type. The service will automatically update the
 * values when the player's data changes.
 */
@Service()
export class LeaderstatsService implements OnInit, OnPlayerJoin, OnPlayerLeave {
	private readonly leaderstats = new Array<LeaderstatEntry>();
	private readonly playerToLeaderstatsMap = new Map<Player, Folder>();
	private readonly playerToValueMap = new Map<Player, Map<string, LeaderstatValue>>();

	constructor(private readonly logger: Logger) {}

	/** @ignore */
	public onInit(): void {
		this.registerStat("Currency", "IntValue", "balance.currency");
	}

	/**
	 * Returns a given stat object for a player. This can be used to update the
	 * leaderboard values for a given player if the stat object is not available
	 * in the reflex store.
	 *
	 * @param player - The player to get the stat object for.
	 * @param statName - The name of the stat to find.
	 * @returns The stat object if it exists.
	 */
	public getStatObject(player: Player, statName: Leaderstats): LeaderstatValue | undefined {
		const valueMap = this.playerToValueMap.get(player);
		if (!valueMap) {
			return;
		}

		const entry = this.leaderstats.find(leaderstatsEntry => leaderstatsEntry.Name === statName);
		if (!entry) {
			return;
		}

		return valueMap.get(entry.Name);
	}

	/**
	 * Gets the value of a key from the player's data.
	 *
	 * @param playerData - The player data object.
	 * @param nestedKey - The key to get the value of.
	 * @returns The value of the nested key.
	 */
	private getPlayerData(
		playerData: PlayerData,
		nestedKey: NestedKeyOf<PlayerData>,
	): ValueOf<LeaderstatValueTypes> {
		const keys = nestedKey.split(".");
		let value = playerData;
		for (const key of keys) {
			value = value[key as never];
		}

		assert(t.number(value) || t.string(value), `Value is not a number or string: ${value}`);

		return value;
	}

	/**
	 * Registers a new stat to the leaderboard.
	 *
	 * @param statName - The name of the stat to register.
	 * @param valueType - The type of value the stat will hold.
	 * @param playerDataKey - An optional key for persistent data that binds to
	 *   the stat.
	 */
	private registerStat(
		statName: Leaderstats,
		valueType: keyof LeaderstatValueTypes,
		playerDataKey?: NestedKeyOf<PlayerData>,
	): void {
		assert(
			this.leaderstats.find(entry => entry.Name === statName) === undefined,
			`Stat provided already exists.`,
		);

		this.leaderstats.push({
			Name: statName,
			PlayerDataKey: playerDataKey,
			ValueType: valueType,
		});

		this.logger.Info(`Registered leaderboard stat ${statName}`);
	}

	/**
	 * Subscribes to the player's data and updates the leaderstats accordingly.
	 *
	 * @param playerEntity - A reference to the player entity.
	 * @param valueMap - The map of leaderstats to update.
	 */
	private subscribeToPlayerData(
		playerEntity: PlayerEntity,
		valueMap: Map<Leaderstats, LeaderstatValue>,
	): void {
		const { janitor, player } = playerEntity;

		janitor.Add(
			store.subscribe(selectPlayerData(player), save => {
				if (!save) {
					return;
				}

				for (const entry of this.leaderstats) {
					if (entry.PlayerDataKey === undefined) {
						continue;
					}

					const stat = valueMap.get(entry.Name);
					if (!stat) {
						continue;
					}

					stat.Value = this.getPlayerData(save, entry.PlayerDataKey);
				}
			}),
		);
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { Name, player } = playerEntity;

		const leaderstats = new Instance("Folder");
		leaderstats.Name = "leaderstats";
		leaderstats.Parent = player;

		this.playerToLeaderstatsMap.set(player, leaderstats);

		this.logger.Info(`Assigning leaderboard stats to ${Name}.`);

		const playerData = store.getState(selectPlayerData(player));
		const valueMap = new Map<Leaderstats, LeaderstatValue>();

		for (const entry of this.leaderstats) {
			const stat = new Instance(entry.ValueType);
			stat.Name = entry.Name;
			stat.Parent = leaderstats;
			valueMap.set(entry.Name, stat);

			if (playerData === undefined || entry.PlayerDataKey === undefined) {
				stat.Value = entry.ValueType === "IntValue" ? 0 : "N/A";
				continue;
			}

			stat.Value = this.getPlayerData(playerData, entry.PlayerDataKey);
		}

		this.subscribeToPlayerData(playerEntity, valueMap);

		this.playerToValueMap.set(player, valueMap);
	}

	/** @ignore */
	public onPlayerLeave({ player }: PlayerEntity): Promise<void> | void {
		const valueMap = this.playerToValueMap.get(player);
		if (valueMap !== undefined) {
			for (const [, value] of valueMap) {
				value.Destroy();
			}
		}

		this.playerToValueMap.delete(player);

		const leaderstats = this.playerToLeaderstatsMap.get(player);
		if (leaderstats !== undefined) {
			leaderstats.Destroy();
		}

		this.playerToLeaderstatsMap.delete(player);
	}
}
