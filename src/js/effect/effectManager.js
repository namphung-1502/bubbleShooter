import { Container } from "pixi.js";
import Effect from "./effect";

export default class EffectManager extends Container {
    constructor() {
        super();
        this._listEffect = [];
        this.defaultBrickTextureName = 'brick_orange';
        this.defaultBrickJson = 'explosion.json';
    }

    brickBreakEffect(x, y) {
        let effect = new Effect(x, y, this, this.defaultBrickTextureName, this.defaultBrickJson);
        effect.playOnceAndDestroy(() => this.remove(effect));
        this._listEffect.push(effect);

    }

    remove(effect) {
        let index = this._listEffect.indexOf(effect);
        if (index !== -1) {
            this._listEffect.splice(index, 1);
            this.removeChild(effect);
        }
    }

    update(delta) {
        this._listEffect.forEach(effect => effect.update(delta))
    }
}