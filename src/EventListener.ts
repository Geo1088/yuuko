import {Client, ClientEvents} from './Yuuko';

/** An object containing context information for processing an event. */
export interface EventContext {
	/** The client that received the event. */
	client: Client;
	/** Other keys can be added as necessary by Client#extendContext. */
	[key: string]: any;
}

/** Options for the EventListener constructor. */
export interface EventListenerOptions {
	/** If true, the listener is only called the first time the event occurs. */
	once?: boolean;
}

/** Class associating an event handler with an event. */
export class EventListener<EventName extends keyof ClientEvents> implements EventListenerOptions {
	/** The name of the event this listener is attached to */
	eventName: EventName;

	/** The function run when the event is emitted */
	listener: (...args: [...ClientEvents[EventName], EventContext]) => void;

	/**
	 * The arguments passed to `client.on()` to register this listener
	 * @deprecated This property is no longer used internally and is only
	 * provided as a getter for backwards compatibility. Notably, its second
	 * argument has never referred to the actual function instance registered on
	 * the client; reference `eventName` and `listener` directly instead.
	 */
	get args (): [this['eventName'], this['listener']] {
		return [this.eventName, this.listener];
	}

	/** If true, the listener is only called the first time the event occurs */
	once: boolean;

	/** The name of the file the event listener was loaded from, if any. */
	filename?: string;

	/**
	 * The actual function registered to the client as the direct listener. This
	 * function gets the context object from the client and runs the user
	 * listener with the event arguments and the context object.
	 * @internal This property should not be used by consumers. In the future,
	 * it is likely that event handlers will be restructured to avoid having
	 * multiple actual functions handling the same event, and this intermediate
	 * step will be unnecessary.
	 */
	computedListener?: (...args: ClientEvents[EventName]) => void;

	constructor (eventName: EventName, listener: (...args: [...ClientEvents[EventName], EventContext]) => void, {
		once = false,
	}: EventListenerOptions = {}) {
		this.eventName = eventName;
		this.listener = listener;

		this.once = once;
	}
}
