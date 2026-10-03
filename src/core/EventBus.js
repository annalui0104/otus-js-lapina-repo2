export class EventBus {
    constructor() {
        this.events = new Map();
    }

    on(eventName, handler) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Set());
        }

        this.events.get(eventName).add(handler);

        return () => {
            this.off(eventName, handler);
        };
    }

    off(eventName, handler) {
        const handlers = this.events.get(eventName);

        if (!handlers) {
            return;
        }

        handlers.delete(handler);

        if (handlers.size === 0) {
            this.events.delete(eventName);
        }
    }

    emit(eventName, payload) {
        const handlers = this.events.get(eventName);

        if (!handlers) {
            return;
        }

        handlers.forEach((handler) => {
            handler(payload);
        });
    }
}