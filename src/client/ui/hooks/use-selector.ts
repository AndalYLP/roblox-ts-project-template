import { useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { RootStore } from "client/store";

export const useRootSelector: UseSelectorHook<RootStore> = useSelector;
