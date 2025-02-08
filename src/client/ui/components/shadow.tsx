import { composeBindings } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

import { useRem, useTheme } from "../hooks";
import { ImageLabel } from "./primitive";

interface ShadowProps extends React.PropsWithChildren {
	shadowBlur?: number;
	shadowColor?: Color3 | React.Binding<Color3>;
	shadowPosition?: number | React.Binding<number>;
	shadowSize?: number | React.Binding<number | UDim2> | UDim2;
	shadowTransparency?: number | React.Binding<number>;
	zIndex?: number;
}

const IMAGE_SIZE = new Vector2(512, 512);
const BLUR_RADIUS = 80;

export function Shadow({
	shadowBlur = 1,
	shadowColor = new Color3(),
	shadowPosition,
	shadowSize = 0,
	shadowTransparency = 0.5,
	zIndex = -1,
	children,
}: Readonly<ShadowProps>): React.ReactNode {
	const rem = useRem();
	const theme = useTheme();

	// eslint-disable-next-line no-param-reassign -- We can't use `rem` inside default values
	shadowPosition ??= rem(1);

	return (
		<ImageLabel
			Image={theme.images.resources.blur}
			Native={{
				AnchorPoint: new Vector2(0.5, 0.5),
				ImageColor3: shadowColor,
				ImageTransparency: shadowTransparency,
				Position: composeBindings(shadowPosition, offset => new UDim2(0.5, 0, 0.5, offset)),
				ScaleType: "Slice",
				Size: composeBindings(shadowSize, size => {
					const sizeOffsetScaled = rem(BLUR_RADIUS * shadowBlur, "pixel");

					if (typeIs(size, "UDim2")) {
						return new UDim2(1, sizeOffsetScaled, 1, sizeOffsetScaled).add(size);
					}

					return new UDim2(1, size + sizeOffsetScaled, 1, size + sizeOffsetScaled);
				}),
				SliceCenter: new Rect(IMAGE_SIZE.div(2), IMAGE_SIZE.div(2)),
				SliceScale: rem(shadowBlur, "pixel"),
				ZIndex: zIndex,
			}}
		>
			{children}
		</ImageLabel>
	);
}
