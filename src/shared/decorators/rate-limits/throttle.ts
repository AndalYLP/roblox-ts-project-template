import { throttle } from "@rbxts/set-timeout";

export function Throttle<T extends object, P extends Array<unknown>>(
	time: number,
	predicate?: (...args: P) => boolean,
) {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: P) => unknown>,
	) => {
		const throttled = throttle(descriptor.value, time);

		if (predicate) {
			let lastResult: unknown;
			descriptor.value = function (this: T, ...args0: Array<unknown>) {
				const args = args0 as P;

				if (predicate(...args)) {
					const result = throttled(this, ...args);
					lastResult = result;
					return result;
				}

				return lastResult;
			};
		} else {
			descriptor.value = throttled;
		}

		return descriptor;
	};
}
