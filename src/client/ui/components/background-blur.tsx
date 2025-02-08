import { useBindingListener, useCamera } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useState } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";
import { GuiService } from "@rbxts/services";

import type { BindingValue } from "types/utils/react";
import coreCall from "utils/core-call";

interface BackgroundBlurProps {
	/** The size of the blur effect. */
	BlurSize?: BindingValue<number>;
	DisableCoreGui?: boolean;
}

/**
 * Renders a background blur effect based on the provided `BlurSize`.
 *
 * @param props - The component props.
 * @param props.BlurSize - The size of the blur effect.
 * @returns The rendered background blur component.
 */
export function BackgroundBlur({
	BlurSize,
	DisableCoreGui = false,
}: Readonly<BackgroundBlurProps>): React.ReactNode {
	const camera = useCamera();
	const [visible, setVisible] = useState(false);

	useBindingListener(BlurSize, (size = 0) => {
		setVisible(size > 0);
	});

	useEffect(() => {
		if (!DisableCoreGui) {
			return;
		}

		coreCall("SetCoreGuiEnabled", Enum.CoreGuiType.All, !visible);
		GuiService.TouchControlsEnabled = !visible;
	}, [visible, DisableCoreGui]);

	return createPortal(<>{visible ? <blureffect Size={BlurSize} /> : undefined}</>, camera);
}
