import { useSelector } from "@rbxts/react-reflex";

import { selectPlayerTheme } from "client/store/slices/theme/theme.selectors";

import type { Theme } from "../themes";

export function useTheme(): Theme {
	return useSelector(selectPlayerTheme);
}
