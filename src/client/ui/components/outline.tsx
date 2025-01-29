/* eslint-disable no-param-reassign -- We can't use `rem` inside default values */
import { blend, composeBindings } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";

import { useRem } from "../hooks";
import { Group } from "./primitive";

interface OutlineProps extends React.PropsWithChildren {
	readonly cornerRadius?: React.Binding<UDim> | UDim;
	readonly innerColor?: Color3 | React.Binding<Color3>;
	readonly innerThickness?: number | React.Binding<number>;
	readonly innerTransparency?: number | React.Binding<number>;
	readonly outerColor?: Color3 | React.Binding<Color3>;
	readonly outerThickness?: number | React.Binding<number>;
	readonly outerTransparency?: number | React.Binding<number>;
	readonly outlineTransparency?: number | React.Binding<number>;
}

function ceilEven(number: number): number {
	return math.ceil(number / 2) * 2;
}

export function Outline({
	cornerRadius,
	innerColor = new Color3(1, 1, 1),
	innerThickness,
	innerTransparency = 1,
	outerColor = new Color3(0, 0, 0),
	outerThickness,
	outerTransparency = 0.85,
	outlineTransparency = 0,
	children,
}: Readonly<OutlineProps>): JSX.Element {
	const rem = useRem();

	innerThickness ??= rem(3, "pixel");
	outerThickness ??= rem(1.5, "pixel");
	cornerRadius ??= new UDim(0, rem(0.5));

	const innerStyle = useMemo(() => {
		const size = composeBindings(
			innerThickness,
			thickness => new UDim2(1, ceilEven(-2 * thickness), 1, ceilEven(-2 * thickness)),
		);

		const position = composeBindings(
			innerThickness,
			thickness => new UDim2(0, thickness, 0, thickness),
		);

		const radius = composeBindings(cornerRadius, innerThickness, (radius0, thickness) =>
			radius0.sub(new UDim(0, thickness)),
		);

		const transparency = composeBindings(outlineTransparency, innerTransparency, (a, b) =>
			math.clamp(blend(a, b), 0, 1),
		);

		return { position, radius, size, transparency };
	}, [innerThickness, innerTransparency, cornerRadius, outlineTransparency]);

	const outerStyle = useMemo(() => {
		const transparency = composeBindings(outlineTransparency, outerTransparency, (a, b) =>
			math.clamp(blend(a, b), 0, 1),
		);

		return { transparency };
	}, [outlineTransparency, outerTransparency]);

	return (
		<>
			<Group
				Native={{
					AnchorPoint: new Vector2(0, 0),
					Position: innerStyle.position,
					Size: innerStyle.size,
				}}
			>
				<uicorner CornerRadius={innerStyle.radius} />
				<uistroke
					Color={innerColor}
					Thickness={innerThickness}
					Transparency={innerStyle.transparency}
				>
					{children}
				</uistroke>
			</Group>

			<Group>
				<uicorner CornerRadius={cornerRadius} />
				<uistroke
					Color={outerColor}
					Thickness={outerThickness}
					Transparency={outerStyle.transparency}
				>
					{children}
				</uistroke>
			</Group>
		</>
	);
}
