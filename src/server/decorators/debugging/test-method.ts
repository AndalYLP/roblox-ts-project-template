import Log from "@rbxts/log";
import { TableToString } from "@rbxts/rbx-debug";

export function TestMethod<T extends object, P extends Array<unknown>>(...args: P) {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: P) => unknown>,
	) => {
		Log.Debug(`running ${target}.${propertyKey} with arguments: ${TableToString(args)}`);

		const returnValue = descriptor.value(target, ...args);

		Log.Debug(`${target}.${propertyKey} returned: ${returnValue}`);
	};
}
