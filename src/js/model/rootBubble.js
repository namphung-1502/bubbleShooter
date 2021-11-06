import { Graphics } from "@pixi/graphics";
import SpriteObject from "./spriteObject";
import { BUBBLE_RADIUS } from "../constant";
import circleCollider from "../collision/circleCollider";
import { calculateDistance, calculator_angle, checkColorBubble, degToRad } from "../utils";

export class rootBubble extends SpriteObject {
    constructor(vx, vy, texture, color, isBombItem = false, isSpecialBall = false) {
        super(texture);
        this.texture = texture;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.isBombItem = isBombItem;
        this.isSpecialBall = isSpecialBall;
        this.collider = new circleCollider(this.center_x, this.center_y, BUBBLE_RADIUS);
        this.normVectorX = 0;
        this.normVectorY = 0;

    }

    draw() {
        this.line = new Graphics();
        this.line.lineStyle({ width: 4, color: 0xFFFFFF, alpha: 1 });
        this.line.moveTo(this.center_x, this.center_y);
        this.line.lineTo(this.lineX, this.lineY);
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;
    }

    changeColor(color) {
        let texture = checkColorBubble(color);
        this.texture = texture;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.center_x = this.x + BUBBLE_RADIUS;
        this.center_y = this.y + BUBBLE_RADIUS;

        let radians = Math.atan2(this.vy, this.vx);
        this.lineY = this.center_y + (Math.sin(radians) * BUBBLE_RADIUS);
        this.lineX = this.center_x + (Math.cos(radians) * BUBBLE_RADIUS);

        this.radToRotation = 2 * Math.PI - (Math.PI / 2 - radians);

        this.collider.center_x = this.center_x;
        this.collider.center_y = this.center_y;

        let edgeCollision = this.collider.detectEdgeCollision();
        this.edgeCollision(edgeCollision);
        this.draw();
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