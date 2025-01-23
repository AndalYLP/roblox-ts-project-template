import { throttle } from "@rbxts/set-timeout";

export function Throttle<T extends object, P extends Array<unknown>>(time: number) {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: Array<unknown>) => P>,
	) => {
		const originalMethod = descriptor.value;

		descriptor.value = throttle(originalMethod, time);

		return descriptor;
	};
}
