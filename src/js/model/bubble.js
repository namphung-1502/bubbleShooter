import SpriteObject from "./spriteObject";
import { BUBBLE_RADIUS, PADDING_TOP } from "../constant";

export const BubbleEvent = Object.freeze({
    NeedRemove: "bubbleEvent:needRemove"
})

export class Bubble extends SpriteObject {
    constructor(texture, r, c, color, vx = 0, vy = 0) {
        super(texture);
        this.r = r;
        this.c = c;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
    }
    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    update(delta) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < PADDING_TOP) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }

}