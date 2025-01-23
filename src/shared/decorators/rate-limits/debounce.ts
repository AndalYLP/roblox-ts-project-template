import { debounce } from "@rbxts/set-timeout";

export function Debounce<T extends object, P extends Array<unknown>>(time: number) {
	return (
		target: T,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<(this: T, ...args: Array<unknown>) => P>,
	) => {
		const originalMethod = descriptor.value;

		descriptor.value = debounce(originalMethod, time);

		return descriptor;
	};
}
