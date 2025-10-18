import * as os from "node:os";
import CommandLine from "./infrastructure/command_line.js";
import { reverse } from "./logic/reverse.js";

export default class App {
	private readonly commandline: CommandLine;

	constructor(commandline = CommandLine.create()) {
		this.commandline = commandline;
	}

	public run(): void {
		if (this.args.length === 0) {
			this.write("Usage: run <text>");
			return;
		}

		if (this.args.length > 1) {
			this.write("too many arguments");
			return;
		}

		this.write(reverse(this.input));
	}

	private get args() {
		return this.commandline.args;
	}

	private get input() {
		return this.args.at(0) || "";
	}

	private write(text: string): void {
		this.commandline.writeOutput(text + os.EOL);
	}
}
