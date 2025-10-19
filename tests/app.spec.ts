import { describe, expect, it } from "bun:test";
import { $ } from "zx";

describe("App (integration)", () => {
	it("return usage hint without input", async () => {
		const { text } = await run();

		expect(text).toBe("Usage: run <text>");
	});

	it("retains empty input", async () => {
		const { text } = await run("");

		expect(text).toBe("");
	});

	it("reverses normal string", async () => {
		const { text } = await run("Hello");

		expect(text).toBe("olleH");
	});

	it("complains when too many arguments provided", async () => {
		const { text } = await run("hello", "world");

		expect(text).toBe("too many arguments");
	});

	async function run(...input: string[]) {
		const output = await parseOutput(...input);

		expect(output.exitCode).toBe(0);

		return {
			text: output.stdout.trim(),
		};
	}

	async function parseOutput(...input: string[]) {
		const cli = "cli.ts";

		if (input.length === 0) {
			return $`bun run ${cli}`;
		}

		if (input.length === 1) {
			return $`bun run ${cli} ${input}`;
		}

		const [a, b] = input;
		return $`bun run ${cli} ${a} ${b}`;
	}
});
