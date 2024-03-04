/**
 * CustomEvent class for handling custom events related to ShakeFace.
 */
class ShakeFaceEvent extends Event {
    /**
     * Constructs a new ShakeFaceEvent instance.
     * @param {string} type - The type of event.
     * @param {Object} [eventData={}] - Additional data to include with the event.
     * @param {Object} [options={}] - Options to configure the event.
     */
    constructor(type, eventData = {}, options = {}) {
        super(type, options);
        this.eventData = eventData;
    }

    /**
     * Get the additional data associated with the event.
     * @returns {Object} - Additional data associated with the event.
     */
    get data() {
        return this.eventData;
    }
}

export default ShakeFaceEvent;
