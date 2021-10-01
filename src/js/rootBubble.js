import { Container } from "pixi.js"
import SpriteObject from "./SpriteObject";
export class rootBubble extends SpriteObject {
    constructor(vx, vy, texture) {
        super(texture);
        this.vx = vx;
        this.vy = vy;
    }



}