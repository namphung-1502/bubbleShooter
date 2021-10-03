import { Graphics } from "pixi.js"
import SpriteObject from "./SpriteObject";
import { GAME_HEIGHT, GAME_WIDTH, PADDING_BOT, BUBBLE_RADIUS } from "./constant";

export class rootBubble extends SpriteObject {
    constructor(vx, vy, texture) {
        super(texture);
        this.vx = vx;
        this.vy = vy;
    }
}