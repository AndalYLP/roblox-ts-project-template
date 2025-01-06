import type React from "@rbxts/react";

interface ErrorPageProps {
	Message: string;
}

export default function ErrorPage({ Message }: Readonly<ErrorPageProps>): React.ReactNode {
	warn(Message);

	return undefined;
}
