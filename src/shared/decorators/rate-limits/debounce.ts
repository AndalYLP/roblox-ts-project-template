import { debounce } from "@rbxts/set-timeout";

export function Debounce<T extends object, P extends Array<unknown>>(
	time: number,
	predicate?: (...args: P) => boolean,
) {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: P) => unknown>,
	) => {
		const debounced = debounce(descriptor.value, time);

		if (predicate) {
			let lastResult: unknown;
			descriptor.value = function (this: T, ...args0: Array<unknown>) {
				const args = args0 as P;

				if (predicate(...args)) {
					const result = debounced(this, ...args);
					lastResult = result;
					return result;
				}

				return lastResult;
			};
		} else {
			descriptor.value = debounced;
		}

		return descriptor;
	};
}
