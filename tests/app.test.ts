import { describe, expect, it } from "bun:test";
import * as os from "node:os";
import {
	CommandLine,
	type OutputTracker,
	type RunOptions,
} from "../src/adapters";
import { App } from "../src/app.ts";

interface RunResult {
	output: OutputTracker<string>;
}

describe("App (unit)", () => {
	it("return usage hint without input", () => {
		const { output } = run({ args: [] });

		expect(output.data).toStrictEqual([`Usage: run <text>${os.EOL}`]);
	});

	it("retains empty input", () => {
		const input = "";

		const { output } = run({ args: [input] });

		expect(output.data).toStrictEqual([os.EOL]);
	});

	it("reverses normal string", () => {
		const input = "Hello";
		const expectedOutput = "olleH";

		const { output } = run({ args: [input] });

		expect(output.data).toStrictEqual([expectedOutput + os.EOL]);
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
