import { GAME_WIDTH, BUBBLE_RADIUS, PADDING_TOP } from "../constant";
import { calculateDistance } from "../utils";
export default class circleCollider {
    constructor(center_x, center_y, rad) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.rad = rad;
    }

    detectEdgeCollision() {
        let edgeCollision;
        if (this.center_x - this.rad < 0) {
            edgeCollision = "left"
        } else if (this.center_x + this.rad > GAME_WIDTH) {
            edgeCollision = "right"
        }

        if (this.center_y - this.rad < PADDING_TOP) {
            edgeCollision = "top"
        }

        return edgeCollision;
    }

    detectCircleCollision(x1, y1, x2, y2) {
        let distance = calculateDistance(x1, y1, x2, y2);
        return distance <= BUBBLE_RADIUS * 2;
    }
}