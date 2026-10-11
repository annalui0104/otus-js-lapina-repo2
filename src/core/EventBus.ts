type EventHandler<Payload> = (
    payload: Payload,
) => void;

type StoredHandler = (
    payload: unknown,
) => void;

export class EventBus<
    Events extends object,
> {
    private readonly events =
        new Map<
            keyof Events,
            Set<StoredHandler>
        >();

    on<K extends keyof Events>(
        eventName: K,
        handler: EventHandler<
            Events[K]
        >,
    ): () => void {
        if (
            !this.events.has(
                eventName,
            )
        ) {
            this.events.set(
                eventName,
                new Set(),
            );
        }

        const handlers =
            this.events.get(
                eventName,
            );

        if (!handlers) {
            return () => {};
        }

        const storedHandler =
            handler as unknown as StoredHandler;

        handlers.add(
            storedHandler,
        );

        return () => {
            this.off(
                eventName,
                handler,
            );
        };
    }

    off<K extends keyof Events>(
        eventName: K,
        handler: EventHandler<
            Events[K]
        >,
    ): void {
        const handlers =
            this.events.get(
                eventName,
            );

        if (!handlers) {
            return;
        }

        handlers.delete(
            handler as unknown as StoredHandler,
        );

        if (
            handlers.size === 0
        ) {
            this.events.delete(
                eventName,
            );
        }
    }

    emit<K extends keyof Events>(
        eventName: K,
        payload?: Events[K],
    ): void {
        const handlers =
            this.events.get(
                eventName,
            );

        if (!handlers) {
            return;
        }

        handlers.forEach(
            (handler) => {
                handler(payload);
            },
        );
    }
}