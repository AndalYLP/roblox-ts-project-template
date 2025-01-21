import Log from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { TableToString } from "@rbxts/rbx-debug";
import { useEffect, useRef } from "@rbxts/react";
import { t } from "@rbxts/t";

interface ChangeObject {
	from: unknown;
	to: unknown;
}

/**
 * A simple hook that checks which prop caused the component to re-render.
 *
 * @param name - The name of the component.
 * @param props - The props of the component.
 * @param logFunction - The function to use for logging. Defaults to
 *   `Log.Debug`.
 * @param logEnabled - Whether or not to log the changes.
 * @see https://github.com/cool-organization/rbx-hooks/blob/main/src/debugging/use-why-did-you-update.ts
 */
export function useWhyDidYouUpdate(
	name: string,
	props: Record<string, unknown>,
	logFunction = Log.Debug,
	logEnabled = true,
): void {
	const previousProps = useRef<Record<string, unknown>>({});

	useEffect(() => {
		const previous = previousProps.current;
		const allKeys = Object.keys({ ...previous, ...props });
		const changesObject: Record<string, ChangeObject> = {};

		for (const key of allKeys) {
			let previousValue = previous[key];
			let updatedValue = props[key];

			if (previousValue !== updatedValue) {
				if (t.table(previousValue)) {
					previousValue = setmetatable(table.clone(previousValue), undefined);
				}

				if (t.table(updatedValue)) {
					updatedValue = setmetatable(table.clone(updatedValue), undefined);
				}

				changesObject[key] = {
					from: previousValue,
					to: updatedValue,
				};
			}
		}

		if (logEnabled && next(changesObject)[0]) {
			logFunction(name + " " + TableToString(changesObject, true));
		}

		previousProps.current = props;
	});
}
