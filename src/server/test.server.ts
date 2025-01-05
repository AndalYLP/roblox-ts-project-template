import { setInterval } from "@rbxts/set-timeout";
import { store } from "./store";

setInterval(() => {
	print(store.getState());
}, 5);
