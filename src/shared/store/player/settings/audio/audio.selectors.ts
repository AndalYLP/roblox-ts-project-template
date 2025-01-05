import { SharedState } from "shared/store";

export function selectPlayerAudioSettings(player: Player) {
	return (state: SharedState) => state.players.settings.audio.get(player);
}
