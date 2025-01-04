/** @ignore */
function addDescendantToCollision(descendant: Instance, group: string): void {
	if (descendant.IsA("BasePart")) descendant.CollisionGroup = group;
}

/**
 * Adds an object and all of its descendants to a collision group.
 * @param object The object to add to the collision group.
 * @param group The collision group to add the object to.
 * @param trackNewDescendants Whether to track new descendants that are added to
 *   the object.
 * @returns A function that can be called to stop tracking new descendants.
 */
export function addToCollisionGroup<T extends boolean>(
	object: Instance,
	group: string,
	trackNewDescendants: T = false as T
): T extends true ? () => void : undefined {
	addDescendantToCollision(object, group);

	for (const descendant of object.GetDescendants()) addDescendantToCollision(descendant, group);

	if (!trackNewDescendants) {
		return undefined as T extends true ? () => void : undefined;
	}

	const connection = object.DescendantAdded.Connect((descendant) => {
		addDescendantToCollision(descendant, group);
	});

	return (() => connection.Disconnect()) as T extends true ? () => void : undefined;
}
