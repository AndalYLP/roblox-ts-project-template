import React from "@rbxts/react";
import type { Root } from "@rbxts/react-roblox";
import { createPortal, createRoot } from "@rbxts/react-roblox";

import { PLAYER_GUI } from "client/constants/player";
import type { MountProps } from "client/ui/providers/root";
import { RootProvider } from "client/ui/providers/root";

/**
 * Mounts the UI component to the Roblox game client.
 *
 * @param props - The options for mounting the UI component.
 * @param props.baseRem - The base rem value for the UI component.
 * @param props.key - The key for the UI component.
 * @param props.remOverride - The rem override value for the UI component.
 * @param props.children - The children elements of the UI component.
 * @returns The root object representing the mounted UI component.
 */
export function mount({ baseRem, key, remOverride, children }: MountProps): Root {
	const root = createRoot(new Instance("Folder"));
	root.render(
		<RootProvider baseRem={baseRem} remOverride={remOverride}>
			{createPortal(children, PLAYER_GUI, key)}
		</RootProvider>,
	);

	return root;
}
