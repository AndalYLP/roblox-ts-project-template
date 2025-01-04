import { SharedState } from "shared/store";

export function selectPlayerAudioSettings(playerId: string) {
	return (state: SharedState) => state.players.settings.audio[playerId];
}
