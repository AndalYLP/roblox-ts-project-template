/* eslint-disable ts/no-magic-numbers -- We are just doing an example */
import { describe, expect, it } from "@rbxts/jest-globals";

// TODO: add an actual test
describe("example", () => {
	it("example", () => {
		expect(typeOf("example")).toBe("string");
	});

	it("should be the same result", () => {
		expect(1 ** 3 + 12 ** 3).toBe(9 ** 3 + 10 ** 3);
	});
});
