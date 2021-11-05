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
        this.mass = 10;
        this.dead = false;
        this.g = 9.81;
    }
    setDead() {
        this.dead = true;
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
        if (this.vy != 0) {
            this.x += this.vx * delta;
            this.y += this.vy * delta + 1 / 2 * (this.g * Math.pow(delta, 2));
        }
        if (this.y < PADDING_TOP) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }

}