local process = require("@lune/process")
local fs = require("@lune/fs")
local roblox = require("@lune/roblox")

local from = process.args[1]
if not from then
	print("specify where to copy from. e.g: pnpm assets:syncback Workspace")
	return
end
local file = fs.readFile("game.rbxl")
local game = roblox.deserializePlace(file)
local serviceToCopyFrom = game:GetService(from)

fs.writeDir(`models/{from}`)

for _, child in serviceToCopyFrom:GetChildren() do
	file = roblox.serializeModel({ child })
	fs.writeFile(`models/{from}/{child.Name}.rbxm`, file)
end
