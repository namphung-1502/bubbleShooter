import { Graphics } from "pixi.js";
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS } from "../constant";
import { degToRad } from "../utils";

export const MouseEvent = Object.freeze({
    ChangeAngle: "LineChange:angle"
})
export default class LineGuide extends Graphics {
    constructor() {
        super();
        this.center_x = GAME_WIDTH / 2;
        this.center_y = GAME_HEIGHT - PADDING_BOT;
        this.style = {
            width: 3,
            color: 0xFF3300,
            alpha: 1
        }
        this.x = 0;
        this.y = 0;

    }
    draw(angle) {
        this.lineStyle(this.style);
        this.moveTo(this.center_x, this.center_y);
        this.lineTo(this.center_x + 3 * BUBBLE_RADIUS * Math.cos(degToRad(angle)), this.center_y - 3 * BUBBLE_RADIUS * Math.sin(degToRad(angle)));
    }

    setDestroy() {
        this.destroy();
    }
    setColor() {
        this.lineStyle({ width: 3, color: 0x000000, alpha: 1 });
    }
}