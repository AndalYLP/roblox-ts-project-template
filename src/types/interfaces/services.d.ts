interface ReplicatedStorage {
	rbxts_include: Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
	TS: Folder & {
		__test__: Folder;
		centurion: Folder & {
			types: Folder & {
				action: ModuleScript;
			};
		};
		components: Folder & {
			abstract: Folder & {
				destroyable: ModuleScript;
				interactable: Folder & {
					clickable: ModuleScript;
					proximity: ModuleScript;
					touch: ModuleScript;
				};
			};
			"interactable-handle": ModuleScript;
		};
		constants: Folder & {
			core: ModuleScript;
			player: ModuleScript;
		};
		decorators: Folder & {
			debugging: ModuleScript & {
				"log-execution-time": ModuleScript;
				"test-method": ModuleScript;
			};
			predicate: ModuleScript;
			"rate-limits": Folder & {
				debounce: ModuleScript;
				throttle: ModuleScript;
			};
		};
		functions: Folder & {
			abbreviator: ModuleScript;
			"game-config": ModuleScript;
			logger: ModuleScript;
			"with-multiplayer": ModuleScript;
		};
		modules: Folder & {
			"3dSound": ModuleScript;
		};
		network: ModuleScript & {
			remotes: Folder;
		};
		store: ModuleScript & {
			middleware: Folder & {
				profiler: ModuleScript;
			};
			slices: Folder & {
				player: ModuleScript & {
					achievements: Folder & {
						"achievements.selectors": ModuleScript;
						"achievements.slice": ModuleScript;
						"achievements.types": ModuleScript;
					};
					balance: Folder & {
						"balance.selectors": ModuleScript;
						"balance.slice": ModuleScript;
						"balance.types": ModuleScript;
					};
					mtx: Folder & {
						"mtx.selectors": ModuleScript;
						"mtx.slice": ModuleScript;
						"mtx.types": ModuleScript;
					};
					"player.selectors": ModuleScript;
					"player.types": ModuleScript;
					settings: ModuleScript & {
						audio: Folder & {
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
	};
	"TS-types": Folder & {
		enum: Folder & {
			badge: ModuleScript;
			mtx: ModuleScript;
		};
		interfaces: Folder & {
			components: Folder;
		};
		utils: Folder;
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
		centurion: Folder & {
			commands: Folder & {
				dispatch: ModuleScript;
			};
			guards: Folder & {
				"is-developer": ModuleScript;
			};
			start: ModuleScript;
		};
		components: Folder;
		network: ModuleScript & {
			middleware: Folder & {
				"enough-balance": ModuleScript;
				throttle: ModuleScript;
			};
		};
		runtime: Script;
		services: Folder & {
			mtx: ModuleScript & {
				events: Folder & {
					"game-passes": ModuleScript;
					products: ModuleScript;
				};
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
			slices: Folder;
		};
	};
}

interface TestService {
	"jest.config": ModuleScript;
	runtime: Script;
}

interface Workspace {
	Baseplate: Part;
}
