import { GAME_WIDTH, GAME_HEIGHT } from "./src/js/constant";
export default class CircleCollision {
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

        if (this.center_y + this.rad < 0) {
            edgeCollision = "top"
        }

        return edgeCollision;
    }
}