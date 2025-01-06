/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param */
import React from "@rbxts/react";

import { IS_DEV, IS_EDIT } from "shared/constants/core";
import { Group } from "./group";

export interface LayerProps extends React.PropsWithChildren {
	/** The display order of the layer. */
	DisplayOrder?: number;
}

/**
 * Renders a collection of components under a screengui.
 *
 * If the game is running, the components are rendered under a `screengui`
 * object, otherwise they are rendered under a `Group` object while in edit mode
 * for storybook support.
 * @example
 *
 * ```tsx
 * <Layer DisplayOrder={1}>
 * 	<TextButton Text="Button 1" />
 * 	<TextButton Text="Button 2" />
 * </Layer>;
 * ```
 * @param props - The component props.
 * @returns The rendered Layer component.
 * @note By default, the `ClampUltraWide` property is set to `true`. This means
 * that the layer will be constrained to a 16:9 aspect ratio on ultra wide
 * monitors. If you want to disable this behavior, set the property to `false`.
 * @component
 * @see https://developer.roblox.com/en-us/api-reference/class/ScreenGui
 */
export function Layer({ DisplayOrder, children }: Readonly<LayerProps>): React.ReactNode {
	return IS_DEV && IS_EDIT ? (
		<Group
			Native={{
				ZIndex: DisplayOrder
			}}
		>
			{children}
		</Group>
	) : (
		<screengui DisplayOrder={DisplayOrder} IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior="Sibling">
			{children}
		</screengui>
	);
}
