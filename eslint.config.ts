import style from "@isentinel/eslint-config";

export default style(
	{
		perfectionist: {
			customClassGroups: [
				"onInit",
				"onStart",
				"onPlayerJoin",
				"onPlayerLeave",
				"onRender",
				"onPhysics",
				"onTick",
			],
		},
		react: true,
		rules: {
			"antfu/consistent-list-newline": "off",
			"perfectionist/sort-objects": [
				"warn",
				{
					customGroups: {
						id: "id",
						name: "name",
						reactProps: ["children", "ref"],
						reflex: ["loadPlayerData"],
					},
					groups: ["id", "name", "unknown", "reflex", "reactProps"],
					order: "asc",
					partitionByComment: "Part:**",
					type: "natural",
				},
			],
			"ts/no-empty-function": "off",
			"ts/no-non-null-assertion": "off",
			"ts/no-unused-expressions": "off",
		},
		test: true,
		typescript: {
			parserOptions: {
				project: "tsconfig.build.json",
			},
			tsconfigPath: "tsconfig.build.json",
		},
	},
	{
		files: ["src/client/ui/hooks/**/*", "src/client/ui/components/**/*"],
		rules: {
			"max-lines-per-function": "off",
		},
	},
	{
		files: ["**/**.story.**"],
		rules: {
			"react/prefer-read-only-props": "off",
		},
	},
	{
		files: ["test/runtime.server.ts"],
		rules: {
			"import/no-namespace": "off",
		},
	},
);
