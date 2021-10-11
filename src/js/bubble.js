import SpriteObject from "./SpriteObject";
import { BUBBLE_RADIUS } from "./constant";

export const BubbleEvent = Object.freeze({
    NeedRemove: "bubbleEvent:needRemove"
})

export class Bubble extends SpriteObject {
    constructor(texture, r, c, color) {
        super(texture);
        this.r = r;
        this.c = c;
        this.color = color;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
    }


}