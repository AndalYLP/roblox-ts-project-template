// eslint-disable-next-line ts/naming-convention -- Required for Roblox global override.
interface _G {
	/** Enable React dev mode. */
	__DEV__: boolean;
	/** Enable React profiling mode. */
	__PROFILE__: boolean;
	/**
	 * Enable React microprofiler mode.
	 *
	 * @see https://discord.com/channels/476080952636997633/506983834877689856/1293072791142268929
	 */
	__REACT_MICROPROFILER_LEVEL: number;
}
