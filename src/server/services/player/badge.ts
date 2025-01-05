import { Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { BadgeService } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerAchievements } from "shared/store/player/achievements";
import { badge, Badge } from "types/enum/badge";
import { OnPlayerJoin } from ".";
import { PlayerEntity } from "./entity";

@Service()
export class PlayerBadgeService implements OnPlayerJoin {
	constructor(private readonly logger: Logger) {}

	/**
	 * Awards a badge to a player if they don't already have it.
	 *
	 * If the badge is unable to be awarded, the error will be logged and the
	 * badge will not be awarded. We will still internally track that the badge
	 * was attempted to be awarded so that any function that relies on a badge
	 * having been awarded will consider it as awarded.
	 * @param playerEntity - The player entity to award the badge to.
	 * @param badge - The badge to be awarded.
	 * @returns A promise that resolves when the badge has been awarded.
	 */
	public async awardBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
		const hasBadge = await this.checkIfPlayerHasBadge(playerEntity, badge);
		if (hasBadge) return;

		return this.giveBadge(playerEntity, badge);
	}

	public async checkIfPlayerHasBadge({ player, UserId }: PlayerEntity, badge: Badge): Promise<boolean> {
		const hasBadge = store.getState(selectPlayerAchievements(player))?.badges.get(badge);
		if (hasBadge !== undefined) return true;

		return Promise.try(() => BadgeService.UserHasBadgeAsync(player.UserId, tonumber(badge) as number));
	}

	public async getBadgeInfo(badge: Badge): Promise<BadgeInfo> {
		return Promise.try(() => BadgeService.GetBadgeInfoAsync(tonumber(badge) as number));
	}

	private async giveBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
		const { player, UserId } = playerEntity;

		const badgeInfo = await this.getBadgeInfo(badge);
		if (!badgeInfo.IsEnabled) {
			this.logger.Warn(`Badge ${badge} is not enabled.`);
			return;
		}

		const [success, awarded] = pcall(() => BadgeService.AwardBadge(player.UserId, tonumber(badge) as number));
		if (!success) throw awarded;

		if (!awarded) {
			this.logger.Warn(`Awarded badge ${badge} to ${UserId} but it was not successful.`);
		} else {
			this.logger.Info(`Awarded badge ${badge} to ${UserId}`);
		}

		store.awardBadge(player, badge, awarded);
	}

	private async awardUnrewardedBadges(playerEntity: PlayerEntity): Promise<void> {
		const { UserId, player } = playerEntity;

		const badges = store.getState(selectPlayerAchievements(player))?.badges;
		if (badges === undefined) return;

		for (const [badge, hasBadge] of badges) {
			if (hasBadge) continue;

			this.awardBadge(playerEntity, badge).catch((e) => {
				this.logger.Error(`Failed to check if ${UserId} has badge ${badge}: ${e}`);
			});
		}
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { UserId } = playerEntity;

		this.awardBadge(playerEntity, badge.Welcome).catch((e) => {
			this.logger.Error(`Failed to check if ${UserId} has badge ${badge.Welcome}: ${e}`);
		});

		this.awardUnrewardedBadges(playerEntity).catch((e) => {
			this.logger.Error(`Failed to award unrewarded badges to ${UserId}: ${e}`);
		});
	}
}
