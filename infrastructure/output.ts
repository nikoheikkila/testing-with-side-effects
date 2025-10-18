import EventEmitter from "node:events";

export class OutputListener {
	private static readonly event: string = "event";
	private readonly emitter: EventEmitter;

	public static create() {
		return new OutputListener();
	}

	public trackOutput() {
		return new OutputTracker(this.emitter, OutputListener.event);
	}

	public emit(data: unknown) {
		this.emitter.emit(OutputListener.event, data);
	}

	private constructor() {
		this.emitter = new EventEmitter();
	}
}

export class OutputTracker {
	public readonly data: string[];

	private readonly emitter: EventEmitter;
	private readonly event: string;
	private readonly trackerFn: (text: string) => void;

	public constructor(emitter: EventEmitter, event: string) {
		this.emitter = emitter;
		this.event = event;
		this.data = [];

		this.trackerFn = (text: string) => this.data.push(text);
		this.emitter.on(this.event, this.trackerFn);
	}
}
