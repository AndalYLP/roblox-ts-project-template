/* eslint-disable @typescript-eslint/naming-convention */

import Log from "@rbxts/log";
import { TableToString } from "@rbxts/rbx-debug";

export const TestMethod = <T extends object, P extends unknown[]>(...args: P) => {
	return (target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<(this: T, ...args: P) => void>) => {
		Log.Debug(`running ${target}.${propertyKey} with arguments: {args}`, TableToString(args));
		const returnValue = descriptor.value(target, ...args);
		Log.Debug(`${target}.${propertyKey} returned: ${returnValue}`);
	};
};
