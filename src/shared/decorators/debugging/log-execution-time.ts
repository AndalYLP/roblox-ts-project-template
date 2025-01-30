import Log from "@rbxts/log";

import { IS_DEV } from "shared/constants/core";

export function LogExecutionTime<T extends object, P extends Array<unknown>>() {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: Array<unknown>) => P>,
	) => {
		if (!IS_DEV) {
			return;
		}

		const originalMethod = descriptor.value;

		descriptor.value = function (this: T, ...args: Array<unknown>) {
			const startT = os.clock();
			const result = originalMethod(this, ...args);
			const endT = os.clock();

			Log.Debug(`${target}.${propertyKey} took ${endT - startT}s`);
			return result;
		};

		return descriptor;
	};
}
