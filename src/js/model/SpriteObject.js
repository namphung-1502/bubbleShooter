import { Sprite } from 'pixi.js'

class SpriteObject extends Sprite {
    constructor(textures) {
        super(textures)
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSpeed(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    setScale(x, y) {
        this.scale.set(x, y);
    }
}

export default SpriteObject;