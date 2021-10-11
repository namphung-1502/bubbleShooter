import { Container, Loader } from "pixi.js";
import SpriteObject from "./SpriteObject";
import { Bubble } from "./bubble";
import { BALL_WIDTH, BALL_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PADDING_BOT } from "./constant";
export default class BoardManager extends Container {
    constructor(list_bubble) {
        super();
        this.list_bubble = list_bubble;
        this._initMap();
    }
    _initMap() {
        for (let i = 0; i < this.list_bubble.length; i++) {
            this.addChild(this.list_bubble[i])
        }
    }
}