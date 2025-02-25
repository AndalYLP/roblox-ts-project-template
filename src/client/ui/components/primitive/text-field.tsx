import React, { useEffect, useState } from "@rbxts/react";

import type { FrameProps } from "client/ui/components/primitive/frame";
import { useRem, useTheme } from "client/ui/hooks";
import type { BindingValue } from "types/utils/react";

interface TextFieldProps extends FrameProps<TextBox> {
	readonly clearTextOnFocus?: boolean | React.Binding<boolean>;
	/**
	 * The font of the text, defaults to the primary font specified by the
	 * default theme.
	 */
	readonly Font?: BindingValue<Enum.Font>;
	readonly Native?: Partial<
		Omit<
			React.InstanceProps<TextBox>,
			"Font" | "Text" | "TextColor" | "TextColor3" | "TextSize"
		>
	>;
	readonly placeholderColor?: Color3 | React.Binding<Color3>;
	readonly placeholderText?: React.Binding<string> | string;
	/**
	 * The default properties of a `TextBox` component, minus the ones specified
	 * in the TextProps.
	 */
	readonly text?: string;
	readonly textSize?: BindingValue<number>;
	readonly onChange?: (rbx: TextBox) => void;
}

export function TextField({
	clearTextOnFocus,
	CornerRadius,
	Font,
	Native,
	onChange,
	placeholderColor,
	placeholderText,
	text,
	textSize,
	children,
}: Readonly<TextFieldProps>): React.ReactNode {
	const [childRef, setChildRef] = useState<TextBox | undefined>(undefined);
	const theme = useTheme();
	const rem = useRem();

	useEffect(() => {
		if (childRef?.IsA("TextBox") === true) {
			childRef.Text = text ?? "";
		}
	}, [childRef, text]);

	return (
		<textbox
			ref={setChildRef}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Change={{ Text: onChange }}
			ClearTextOnFocus={clearTextOnFocus}
			Font={Font ?? theme.fonts.primary.regular}
			PlaceholderColor3={placeholderColor}
			PlaceholderText={placeholderText}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Text={text}
			TextSize={textSize ?? rem(1)}
			{...Native}
		>
			{children}
			{CornerRadius ? <uicorner CornerRadius={CornerRadius} /> : undefined}
		</textbox>
	);
}
