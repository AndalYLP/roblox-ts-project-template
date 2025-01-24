import React from "@rbxts/react";

import { $compileTime } from "rbxts-transform-debug";

import { Layer, TextLabel } from "../components/primitive";
import { useRem } from "../hooks";

export function App(): React.ReactNode {
	const rem = useRem();

	return (
		<Layer>
			<TextLabel
				Native={{
					AnchorPoint: new Vector2(0, 1),
					Position: UDim2.fromScale(0, 1),
					Size: new UDim2(1, 0, 0, rem(2.5)),
					TextXAlignment: "Left",
				}}
				Text={`Compile time: ${$compileTime("ISO-8601")}`}
				TextSize={rem(3)}
			/>
		</Layer>
	);
}
