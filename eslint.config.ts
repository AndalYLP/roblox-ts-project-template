import style, { GLOB_TS } from "@isentinel/eslint-config";

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
				"error",
				{
					customGroups: {
						id: "^id$",
						name: "^name$",
						callbacks: ["\b(on[A-Z][a-zA-Z]*)\b"],
						reactProps: ["^children$", "^ref$"],
						reflex: ["^loadPlayerData$", "^closePlayerData$"],
					},
					groups: ["id", "name", "reflex", "unknown", "reactProps"],
					order: "asc",
					partitionByComment: "^Part:\\*\\*(.*)$",
					type: "natural",
				},
			],
			"ts/no-non-null-assertion": "off",
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
		files: [GLOB_TS],
		rules: {
			"no-param-reassign": "error",
			"ts/no-magic-numbers": [
				"error",
				{
					ignore: [0, 1],
					ignoreEnums: true,
					ignoreNumericLiteralTypes: true,
					ignoreReadonlyClassProperties: true,
					ignoreTypeIndexes: true,
				},
			],
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
