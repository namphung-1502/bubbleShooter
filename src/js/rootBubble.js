import { Graphics } from "pixi.js"
import SpriteObject from "./SpriteObject";
import { GAME_HEIGHT, GAME_WIDTH, PADDING_BOT, BUBBLE_RADIUS } from "./constant";

export class rootBubble extends SpriteObject {
    constructor(vx, vy, texture) {
        super(texture);
        this.vx = vx;
        this.vy = vy;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
    }


    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
    }
    calcuVelocity(x, y) {
        var vCollision = { x: x - this.center_x, y: y - this.center_y };
        var distance = Math.sqrt((x - this.center_x) * (x - this.center_x) + (y - this.center_y) * (y - this.center_y));
        var vNormal = { x: vCollision.x / distance, y: vCollision.y / distance };
        this.vx = vNormal.x * 3;
        this.vy = vNormal.y * 3;
    }
}