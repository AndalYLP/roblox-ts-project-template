import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";

import { LocalPlayer } from "client/constants/player";

/**
 * Returns whether the local player has a premium membership or not. This will
 * update when the player's membership changes.
 *
 * @returns True if the local player has a premium membership.
 */
export function usePremium(): boolean {
	const [isPremium, setPremiumState] = useState(
		LocalPlayer.MembershipType === Enum.MembershipType.Premium,
	);

	useEventListener(Players.PlayerMembershipChanged, player => {
		setPremiumState(player.MembershipType === Enum.MembershipType.Premium);
	});

	return isPremium;
}
