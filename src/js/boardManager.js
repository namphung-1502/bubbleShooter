import { Container, Loader } from "pixi.js";
import SpriteObject from "./SpriteObject";
import { BubbleEvent, Bubble } from "./bubble";
import { findNeighbor } from "./utils";
import { BALL_WIDTH, BALL_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PADDING_BOT } from "./constant";

export const BoardManagerEvent = Object.freeze({
    RemoveChild: "boardmanager:removechild",
    AddChild: "boardmanager:addchild"
})
export default class BoardManager extends Container {
    constructor(list_bubble) {
        super();
        this.list_bubble = list_bubble;
        this._initMap();

    }
    _initMap() {
        for (let i = 0; i < this.list_bubble.length; i++) {
            this.list_bubble[i].on(BubbleEvent.NeedRemove, this.removeBubble, this)
            this.addChild(this.list_bubble[i]);
        }
    }
    addBubble(bubble) {
        this.list_bubble.push(bubble);
        this.addChild(bubble);
    }

    removeBubble(bubble) {
        let neighbor = findNeighbor(this.list_bubble, bubble.c, bubble.r);
        let stack = [];
        stack.push(bubble);
        for (let i = 0; i < neighbor.length; i++) {

        }

        // var index = this.list_bubble.indexOf(bubble);
        // this.list_bubble.splice(index, 1);
        // this.removeChild(bubble);
    }
}