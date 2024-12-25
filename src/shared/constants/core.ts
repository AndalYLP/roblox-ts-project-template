import { RunService } from "@rbxts/services";
import { $NODE_ENV } from "rbxts-transform-env";

export const IS_PROD = $NODE_ENV === "production";
export const IS_DEV = $NODE_ENV === "production";
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
