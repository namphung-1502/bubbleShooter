import SpriteObject from "./SpriteObject";
import { BUBBLE_RADIUS } from "./constant";

export class Bubble extends SpriteObject {
    constructor(texture, r, c) {
        super(texture);
        this.r = r;
        this.c = c;

    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
    }
}