import { Service } from "@flamework/core";
import { Collection, createCollection, Document, setConfig } from "@rbxts/lapis";
import DataStoreServiceMock from "@rbxts/lapis-mockdatastore";
import { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { IS_DEV, IS_STUDIO } from "shared/constants/core";
import { defaultPlayerData, PlayerData, selectPlayerData } from "shared/store/player";
import { KickCode } from "types/enum/kick-reason";
import { PlayerRemovalService } from "../removal";
import { validate } from "./validate";

/**
 * Service for loading and saving player data. This service is responsible for
 * loading player data when a player joins the game, and hooking up reflex data
 * changes to the player's data document in the data store.
 */
@Service()
export class PlayerDataService {
	private readonly collection: Collection<PlayerData>;

	constructor(
		private readonly logger: Logger,
		private readonly playerRemovalService: PlayerRemovalService
	) {
		if (IS_DEV && IS_STUDIO) {
			setConfig({
				dataStoreService: new DataStoreServiceMock()
			});
		}

		this.collection = createCollection<PlayerData>(IS_STUDIO ? "development" : "production", {
			defaultData: defaultPlayerData,
			validate
		});
	}

	/**
	 * Loads the player data for the given player.
	 * @param player - The player to load data for.
	 * @returns The player data document if it was loaded successfully.
	 */
	public async loadPlayerData(player: Player): Promise<Document<PlayerData> | void> {
		try {
			const document = await this.collection.load(tostring(player.UserId), [player.UserId]);

			if (!player.IsDescendantOf(Players)) return;

			const unsubscribe = store.subscribe(selectPlayerData(player), (data) => {
				if (data) document.write(data);
			});

			document.beforeClose(() => {
				unsubscribe();
			});

			store.loadPlayerData(player, document.read());

			return document;
		} catch (e) {
			this.logger.Warn(`Failed to load data for ${player.UserId}: ${e}`);
			this.playerRemovalService.removeForBug(player, KickCode.PlayerProfileUndefined);
		}
	}
}
