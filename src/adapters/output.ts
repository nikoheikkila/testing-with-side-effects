import EventEmitter from "node:events";

export class OutputListener<T> {
	private static readonly event: string = "event";
	private readonly emitter: EventEmitter;

	public static create<T>(): OutputListener<T> {
		return new OutputListener<T>();
	}

	public trackOutput(): OutputTracker<T> {
		return new OutputTracker(this.emitter, OutputListener.event);
	}

	public emit(data: T) {
		this.emitter.emit(OutputListener.event, data);
	}

	private constructor() {
		this.emitter = new EventEmitter();
	}
}

export class OutputTracker<T> {
	public readonly data: T[];

	private readonly emitter: EventEmitter;
	private readonly event: string;

	public constructor(emitter: EventEmitter, event: string) {
		this.emitter = emitter;
		this.event = event;
		this.data = [];

		this.register();
	}

	private register() {
		this.emitter.on(this.event, (entry: T) => this.data.push(entry));
	}
}
