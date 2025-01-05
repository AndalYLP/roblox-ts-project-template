import { describe, expect, it } from "@rbxts/jest-globals";
import { sub } from "server/sub";

describe("sub", () => {
	it("subs 2 and 1 to equal 1", () => {
		expect(sub(2, 1)).toBe(1);
	});
});
