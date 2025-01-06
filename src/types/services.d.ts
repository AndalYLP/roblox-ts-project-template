/* eslint-disable @typescript-eslint/naming-convention */
interface ReplicatedStorage {
	TS: Folder & {
		constants: Folder & {
			core: ModuleScript;
			player: ModuleScript;
		};
		functions: Folder & {
			"game-config": ModuleScript;
			logger: ModuleScript;
			withMultiplayer: ModuleScript;
		};
		modules: Folder & {
			"3dSound": ModuleScript;
		};
		network: ModuleScript & {
			mtx: ModuleScript;
			store: ModuleScript;
		};
		store: ModuleScript & {
			middleware: Folder & {
				profiler: ModuleScript;
			};
			player: ModuleScript & {
				achievements: ModuleScript & {
					"achievements.selectors": ModuleScript;
					"achievements.slice": ModuleScript;
					"achievements.types": ModuleScript;
				};
				balance: ModuleScript & {
					"balance.selectors": ModuleScript;
					"balance.slice": ModuleScript;
					"balance.types": ModuleScript;
				};
				mtx: ModuleScript & {
					"mtx.selectors": ModuleScript;
					"mtx.slice": ModuleScript;
					"mtx.types": ModuleScript;
				};
				"player.selectors": ModuleScript;
				"player.types": ModuleScript;
				settings: ModuleScript & {
					audio: ModuleScript & {
						"audio.selectors": ModuleScript;
						"audio.slice": ModuleScript;
						"audio.types": ModuleScript;
					};
					"settings.selectors": ModuleScript;
					"settings.types": ModuleScript;
				};
			};
		};
	};
	"TS-types": Folder & {
		enum: Folder & {
			badge: ModuleScript;
			mtx: ModuleScript;
		};
		interfaces: Folder;
	};
	rbxts_include: Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
	utils: Folder & {
		"core-call": ModuleScript;
		flamework: ModuleScript;
		"no-yield": ModuleScript;
		physics: ModuleScript;
		player: ModuleScript;
	};
}

interface ServerScriptService {
	TS: Folder & {
		__test__: Folder & {
			"example.spec": ModuleScript;
			"jest.config": ModuleScript;
		};
		decorators: Folder & {
			debugging: ModuleScript & {
				"log-execution-time": ModuleScript;
				"test-method": ModuleScript;
			};
			mtx: ModuleScript;
		};
		network: ModuleScript;
		runtime: Script;
		services: Folder & {
			mtx: ModuleScript & {
				GamePassEvents: ModuleScript;
				ProductEvents: ModuleScript;
			};
			player: ModuleScript & {
				badge: ModuleScript;
				character: ModuleScript;
				data: ModuleScript & {
					validate: ModuleScript;
				};
				entity: ModuleScript;
				leaderstats: ModuleScript;
				removal: ModuleScript;
				"with-player-entity": ModuleScript;
			};
		};
		store: ModuleScript & {
			middleware: Folder & {
				broadcaster: ModuleScript;
			};
		};
	};
	utils: Folder;
}

interface TestService {
	TS: Folder & {
		"jest.config": ModuleScript;
		runtime: Script;
	};
}

interface Workspace {
	Baseplate: Part;
}

interface _G {
	/** Enable React dev mode. */
	__DEV__: boolean;
	/** Enable React profiling mode. */
	__PROFILE__: boolean;
}
