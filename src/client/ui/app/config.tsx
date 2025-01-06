import type { ProfilerOnRenderCallback } from "@rbxts/react";

import { IS_DEV } from "shared/constants/core";

export function reactConfig(): void {
	if (!IS_DEV) {
		return;
	}

	_G.__DEV__ = true;
	_G.__PROFILE__ = false;

	// Avoid implicit React import before setting the __DEV__ flag
	// eslint-disable-next-line no-void
	void import("client/ui/functions/profiler").then(({ profileAllComponents }) => {
		profileAllComponents();
	});
}

export async function createApp(): Promise<void> {
	// Avoid implicit React import before setting the __DEV__ flag
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const React = await import("@rbxts/react");
	const { App } = await import("client/ui/app");
	const { mount } = await import("client/ui/functions");

	mount({ key: "app", children: <App /> });
}

export const onRenderProfiler: ProfilerOnRenderCallback = (...args: Parameters<ProfilerOnRenderCallback>) => {
	const [id, phase, actualDuration, baseDuration, startTime, commitTime, interactions] = args;
	print(
		`id: ${id}, phase: ${phase}, actualDuration: ${actualDuration}, baseDuration: ${baseDuration}, startTime: ${startTime}, commitTime: ${commitTime}, interactions: ${interactions}`
	);
};
