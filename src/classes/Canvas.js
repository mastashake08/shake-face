export default class Canvas extends HTMLCanvasElement {

    static create() {
        return new this();
    }

    constructor() {
        super();
    }
}