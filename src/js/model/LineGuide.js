import { Graphics } from "pixi.js";
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS, ITEM_BAR_HEIGHT, PADDING_TOP } from "../constant";
import { degToRad, calculateDistance } from "../utils";

export const MouseEvent = Object.freeze({
    ChangeAngle: "LineChange:angle"
})
export default class LineGuide extends Graphics {
    constructor(color = 0xFF3300, list_bubble) {
        super();
        this.list_bubble = list_bubble;
        this.center_x = GAME_WIDTH / 2;
        this.center_y = GAME_HEIGHT - PADDING_BOT - ITEM_BAR_HEIGHT;
        this.style = {
            width: 3,
            color: color,
            alpha: 1
        }
        this.x = 0;
        this.y = 0;

    }
    draw(angle) {
        let p1 = { x: this.center_x, y: this.center_y };
        let p2 = {
            x: this.center_x + 10 * BUBBLE_RADIUS * Math.cos(degToRad(angle)),
            y: this.center_y - 10 * BUBBLE_RADIUS * Math.sin(degToRad(angle))
        };

        let distance = calculateDistance(p1.x, p1.y, p2.x, p2.y);
        let norm = { x: (p2.x - p1.x) / distance, y: (p2.y - p1.y) / distance };
        let startLine = p1;
        let endLine = { x: p1.x + norm.x * 4, y: p1.y + norm.y * 4 };
        let stepX = norm.x * 4;
        let stepY = norm.y * 4;
        let end = false;
        while (!end) {
            this.lineStyle(this.style);
            this.moveTo(startLine.x, startLine.y);
            this.lineTo(endLine.x, endLine.y);
            startLine.x = endLine.x + stepX;
            if (startLine.x < 0) {
                startLine.x = 0;
                startLine.y -= BUBBLE_RADIUS;
                stepX = -stepX;
            }
            if (startLine.x > GAME_WIDTH) {
                startLine.x = GAME_WIDTH;
                stepX = -stepX;
            }

            startLine.y = endLine.y + stepY;
            if (this.checkPointInBall(startLine) || startLine.y < PADDING_TOP - 3) {
                end = true;
            }
            endLine.x = startLine.x + stepX;
            endLine.y = startLine.y + stepY;

        }


    }
    checkPointInBall(point) {
        for (let i = 0; i < this.list_bubble.length; i++) {
            let bubble = this.list_bubble[i];
            if ((point.x < bubble.center_x + BUBBLE_RADIUS && point.x > bubble.center_x - BUBBLE_RADIUS) &&
                (point.y < bubble.center_y + BUBBLE_RADIUS && point.y > bubble.center_y - BUBBLE_RADIUS)) {
                return true;
            }
        }
        return false;
    }
    setDestroy() {
        this.destroy();
    }
}