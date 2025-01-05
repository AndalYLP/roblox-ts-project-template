/* eslint-disable @typescript-eslint/naming-convention */
import Log from "@rbxts/log";

export const LogExecutionTime = <T extends object, P extends unknown[]>() => {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: unknown[]) => P>
	) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (this: T, ...args: unknown[]) {
			const startT = os.clock();
			const result = originalMethod(this, ...args);
			const endT = os.clock();

			Log.Debug(`${target}.${propertyKey} took ${endT - startT}s`);
			return result;
		};

		return descriptor;
	};
};
