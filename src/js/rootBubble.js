import { Graphics } from "pixi.js"
import SpriteObject from "./SpriteObject";
import { BUBBLE_RADIUS } from "./constant";
import CircleCollision from "../../circleCollision";

export class rootBubble extends SpriteObject {
    constructor(vx, vy, texture) {
        super(texture);
        this.vx = vx;
        this.vy = vy;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
        this.collider = new CircleCollision(this.center_x, this.center_y, BUBBLE_RADIUS);
    }


    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;

        this.collider.center_x = this.center_x;
        this.collider.center_y = this.center_y;

        let edgeCollision = this.collider.detectEdgeCollision();
        this.edgeCollision(edgeCollision);
    }

    // calculate velocity
    calcuVelocity(x, y) {
        var vCollision = { x: x - this.center_x, y: y - this.center_y };
        var distance = Math.sqrt((x - this.center_x) * (x - this.center_x) + (y - this.center_y) * (y - this.center_y));
        var vNormal = { x: vCollision.x / distance, y: vCollision.y / distance };
        this.vx = vNormal.x * 3;
        this.vy = vNormal.y * 3;
    }

    edgeCollision(edge) {
        if (edge === "left") {
            this.vx = -this.vx;
        } else if (edge == "right") {
            this.vx = -this.vx;
        }

        if (edge == "top") {
            console.log("top")
        }
    }

}