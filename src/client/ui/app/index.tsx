import React from "@rbxts/react";

import { Layer, TextLabel } from "client/ui/components/primitive";
import { useRem } from "client/ui/hooks";
import { $compileTime } from "rbxts-transform-debug";

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
