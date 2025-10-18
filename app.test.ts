import { describe, expect, it } from "bun:test";
import * as os from "node:os";
import App from "./app.ts";
import CommandLine, { type RunOptions } from "./infrastructure/command_line.ts";
import type { OutputTracker } from "./infrastructure/output.ts";

interface RunResult {
	output: OutputTracker;
}

describe("App", () => {
	it("reads command-line argument, executes it with shell, and writes result", () => {
		const input = "Hello";
		const expectedOutput = "olleH";

		const { output } = run({ args: [input] });

		expect(output.data).toStrictEqual([expectedOutput + os.EOL]);
	});

	it("writes usage when no arguments provided", () => {
		const { output } = run({ args: [] });

		expect(output.data).toStrictEqual([`Usage: run <text>${os.EOL}`]);
	});

	it("complains when too many arguments provided", () => {
		const { output } = run({ args: ["a", "b"] });

		expect(output.data).toStrictEqual([`too many arguments${os.EOL}`]);
	});
});

function run({ args }: RunOptions): RunResult {
	const commandLine = CommandLine.createNull({ args });
	const output = commandLine.trackOutput();

	const app = new App(commandLine);
	app.run();

	return { output };
}
