import React from "@rbxts/react";

import { Layer, TextLabel } from "../components/primitive";

export function App(): React.ReactNode {
	return (
		<Layer>
			<TextLabel Text="Hello world!" />
		</Layer>
	);
}
