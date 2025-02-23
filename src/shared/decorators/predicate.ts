export function Predicate<T extends object, P extends Array<unknown>>(
	predicate: (...args: P) => boolean,
) {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: P) => unknown>,
	) => {
		const originalCallback = descriptor.value;

		descriptor.value = function (this: T, ...args0: Array<unknown>): unknown {
			const args = args0 as P;

			if (predicate(...args)) {
				return originalCallback(this, ...args);
			}

			return undefined;
		};

		return descriptor;
	};
}
