import type { ThemeFonts } from "./fonts";
import type { ThemeImages } from "./images";

export * from "./configs";
export * from "./fonts";
export * from "./images";

export interface Theme {
	colors: {
		background: Color3;
		border: Color3;
		card: Color3;
		primary: Color3;
		secondary: Color3;
		text: {
			link: Color3;
			primary: Color3;
			secondary: Color3;
		};
	};
	fonts: ThemeFonts;
	images: ThemeImages;
}
