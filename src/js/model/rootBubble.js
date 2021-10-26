import SpriteObject from "./spriteObject";
import { BUBBLE_RADIUS } from "../constant";
import circleCollider from "../collision/circleCollider";
import { calculateDistance, calculator_angle, degToRad } from "../utils";

export class rootBubble extends SpriteObject {
    constructor(vx, vy, texture, color) {
        super(texture);
        this.texture = texture;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.collider = new circleCollider(this.center_x, this.center_y, BUBBLE_RADIUS);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
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

    stop() {
        this.vx = 0;
        this.vy = 0;
    }

    // calculate velocity
    calcuVelocity(x, y) {
        var angle = calculator_angle(this.center_x, x, this.center_x, this.center_x - 10, this.center_y, y, this.center_y, this.center_y);
        this.vx = Math.cos(degToRad(angle)) * 8;
        this.vy = -1 * Math.sin(degToRad(angle)) * 8;
        return;
    }

    edgeCollision(edge) {
        if (edge === "left") {
            this.vx = -this.vx;
        } else if (edge == "right") {
            this.vx = -this.vx;
        }

    }
}