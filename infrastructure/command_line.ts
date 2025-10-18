import { OutputListener } from "./output.js";

export interface RunOptions {
	args: string[];
}

interface Process {
	argv: string[];
	stdout: {
		write(text: string): void;
	};
}

export default class CommandLine {
	private readonly process: Process;
	private readonly listener: OutputListener;

	public static create(): CommandLine {
		return new CommandLine(process);
	}

	public static createNull({ args }: RunOptions) {
		return new CommandLine(new StubProcess(args));
	}

	private constructor(proc: Process) {
		this.process = proc;
		this.listener = OutputListener.create();
	}

	public get args() {
		return this.process.argv.slice(2);
	}

	public writeOutput(text: string) {
		this.process.stdout.write(text);
		this.listener.emit(text);
	}

	public trackOutput() {
		return this.listener.trackOutput();
	}
}

class StubProcess implements Process {
	private readonly args: string[];

	constructor(args: string[]) {
		this.args = args;
	}

	public get argv(): string[] {
		return ["node", "script.js", ...this.args];
	}

	public get stdout() {
		return {
			write() {},
		};
	}
}
