import React from "@rbxts/react";

import type { FrameProps } from "client/ui/components/primitive/frame";

export interface ButtonProps extends FrameProps<TextButton> {
	/** The default properties of a `TextButton` component. */
	Native?: Partial<React.InstanceProps<TextButton>>;
	/** A callback that is triggered when the button is clicked. */
	onClick?: () => void;
	/**
	 * A callback that is triggered when the mouse button is pressed down on the
	 * button.
	 */
	onMouseDown?: () => void;
	/** A callback that is triggered when the mouse enters the button. */
	onMouseEnter?: () => void;
	/** A callback that is triggered when the mouse leaves the button. */
	onMouseLeave?: () => void;
	/**
	 * A callback that is triggered when the mouse button is released on the
	 * button.
	 */
	onMouseUp?: () => void;
}

/**
 * Button component.
 *
 * @example
 *
 * ```tsx
 * <Button
 * 	CornerRadius={new UDim(0, 8)}
 * 	Native={{ Size: new UDim2(0, 100, 0, 100) }}
 * 	onClick={useCallback(() => {
 * 		print("Hello World!");
 * 	}, [])}
 * />;
 * ```
 *
 * Button is released on the button.
 *
 * @param buttonProps - The properties of the Button component.
 * @returns The rendered Button component.
 * @component
 * @see https://create.roblox.com/docs/reference/engine/classes/TextButton
 */
export function Button({
	CornerRadius,
	Native,
	onClick,
	onMouseDown,
	onMouseEnter,
	onMouseLeave,
	onMouseUp,
	children,
}: Readonly<ButtonProps>): React.ReactNode {
	const event: Record<string, () => void> = {};

	if (onClick) {
		event.Activated = onClick;
	}

	if (onMouseDown) {
		event.MouseButton1Down = onMouseDown;
	}

	if (onMouseUp) {
		event.MouseButton1Up = onMouseUp;
	}

	if (onMouseEnter) {
		event.MouseEnter = onMouseEnter;
	}

	if (onMouseLeave) {
		event.MouseLeave = onMouseLeave;
	}

	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			Event={event}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Text=""
			{...Native}
		>
			{CornerRadius ? <uicorner CornerRadius={CornerRadius} /> : undefined}
			{children}
		</textbutton>
	);
}
