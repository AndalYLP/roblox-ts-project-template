interface ReplicatedStorage {
	TS: Folder & {
		constants: Folder & {
			core: ModuleScript;
			player: ModuleScript;
		};
	};
	rbxts_include: Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
}

interface ServerScriptService {
	TS: Folder & {
		test: Script;
	};
}

interface TestService {
	TS: Script;
}

interface Workspace {
	Baseplate: Part;
}
