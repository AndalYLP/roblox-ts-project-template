interface ReplicatedStorage {
	rbxts_include: {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	} & Folder;
	TS: {
		constants: {
			core: ModuleScript;
			player: ModuleScript;
		} & Folder;
		functions: {
			"game-config": ModuleScript;
			logger: ModuleScript;
			withMultiplayer: ModuleScript;
		} & Folder;
		modules: {
			"3dSound": ModuleScript;
		} & Folder;
		network: {
			mtx: ModuleScript;
			store: ModuleScript;
		} & ModuleScript;
		store: {
			middleware: {
				profiler: ModuleScript;
			} & Folder;
			player: {
				achievements: {
					"achievements.selectors": ModuleScript;
					"achievements.slice": ModuleScript;
					"achievements.types": ModuleScript;
				} & ModuleScript;
				balance: {
					"balance.selectors": ModuleScript;
					"balance.slice": ModuleScript;
					"balance.types": ModuleScript;
				} & ModuleScript;
				mtx: {
					"mtx.selectors": ModuleScript;
					"mtx.slice": ModuleScript;
					"mtx.types": ModuleScript;
				} & ModuleScript;
				"player.selectors": ModuleScript;
				"player.types": ModuleScript;
				settings: {
					audio: {
						"audio.selectors": ModuleScript;
						"audio.slice": ModuleScript;
						"audio.types": ModuleScript;
					} & ModuleScript;
					"settings.selectors": ModuleScript;
					"settings.types": ModuleScript;
				} & ModuleScript;
			} & ModuleScript;
		} & ModuleScript;
	} & Folder;
	"TS-types": {
		enum: {
			badge: ModuleScript;
			mtx: ModuleScript;
		} & Folder;
		interfaces: Folder;
	} & Folder;
	utils: {
		"core-call": ModuleScript;
		flamework: ModuleScript;
		"no-yield": ModuleScript;
		physics: ModuleScript;
		player: ModuleScript;
	} & Folder;
}

interface ServerScriptService {
	TS: {
		__test__: {
			"example.spec": ModuleScript;
			"jest.config": ModuleScript;
		} & Folder;
		decorators: {
			debugging: {
				"log-execution-time": ModuleScript;
				"test-method": ModuleScript;
			} & ModuleScript;
			mtx: ModuleScript;
		} & Folder;
		network: ModuleScript;
		runtime: Script;
		services: {
			mtx: {
				GamePassEvents: ModuleScript;
				ProductEvents: ModuleScript;
			} & ModuleScript;
			player: {
				badge: ModuleScript;
				character: ModuleScript;
				data: {
					validate: ModuleScript;
				} & ModuleScript;
				entity: ModuleScript;
				leaderstats: ModuleScript;
				removal: ModuleScript;
				"with-player-entity": ModuleScript;
			} & ModuleScript;
		} & Folder;
		store: {
			middleware: {
				broadcaster: ModuleScript;
			} & Folder;
		} & ModuleScript;
	} & Folder;
	utils: Folder;
}

interface TestService {
	TS: {
		"jest.config": ModuleScript;
		runtime: Script;
	} & Folder;
}

interface Workspace {
	Baseplate: Part;
}

// eslint-disable-next-line ts/naming-convention -- Required for Roblox global override.
interface _G {
	/** Enable React dev mode. */
	__DEV__: boolean;
	/** Enable React profiling mode. */
	__PROFILE__: boolean;
}
