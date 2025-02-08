import type { Theme } from "client/ui/themes";
import { Themes } from "client/ui/themes";
import type { SharedState } from "shared/store";

export function selectPlayerTheme(_state: SharedState): Theme {
	return Themes.defaultTheme;
}
