import { utils } from "pixi.js";

export default class Collider extends utils.EventEmitter {
    constructor(object) {
        super();
        this.object = object;
    }
}