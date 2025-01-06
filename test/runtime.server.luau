-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local runCLI = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jest", "src").runCLI
local ServerScriptService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").ServerScriptService
local success, result = runCLI(script, {
	verbose = true,
	ci = false
}, { ServerScriptService.TS.__test__ }):awaitStatus()
if not success then
	error(`Failed to run test: {result}`)
end
