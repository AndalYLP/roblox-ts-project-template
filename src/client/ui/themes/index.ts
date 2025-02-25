import type { ThemeColors } from "client/ui/themes/colors";
import type { ThemeFonts } from "client/ui/themes/fonts";
import type { ThemeImages } from "client/ui/themes/images";

export * from "client/ui/themes/configs";
export * from "client/ui/themes/fonts";
export * from "client/ui/themes/images";

export interface Theme {
	colors: ThemeColors;
	fonts: ThemeFonts;
	images: ThemeImages;
}
