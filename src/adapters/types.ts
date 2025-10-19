export interface RunOptions {
	args: string[];
}

export interface Process {
	argv: string[];
	stdout: {
		write(text: string): void;
	};
}
