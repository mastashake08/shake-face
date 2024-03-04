export default class ShakeCanvas extends HTMLCanvasElement {
    #_shadow;
    static observedAttributes = ["width", "height"];
    static create(width = 250, height = 250) {
        return new this(width, height);
    }

    constructor(width = 250, height = 250) {
        super();
        this.width = width;
        this.height = height;
    }

    connectedCallback() {
        this.#_shadow = this.attachShadow({ mode: "open" });
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}

customElements.define("shake-canvas", ShakeCanvas);