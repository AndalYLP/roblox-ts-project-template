import { useSelector } from "@rbxts/react-reflex";

import { selectPlayerTheme } from "client/store/slices/theme/theme.selectors";
import type { Theme } from "client/ui/themes";

export function useTheme(): Theme {
	return useSelector(selectPlayerTheme);
}
