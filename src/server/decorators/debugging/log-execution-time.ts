import Log from "@rbxts/log";

export function LogExecutionTime<T extends object, P extends Array<unknown>>() {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: Array<unknown>) => P>,
	) => {
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
