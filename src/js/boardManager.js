import { Container, Loader } from "pixi.js";
import SpriteObject from "./SpriteObject";
import { BubbleEvent, Bubble } from "./bubble";
import { findNeighbor, isInArray, checkFloatBubble, randomInRange } from "./utils";
import Queue from "./Queue";
import { BALL_WIDTH, BALL_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS } from "./constant";

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
        var queue = new Queue();
        queue.enqueue(bubble);
        var listBubbleRemove = [];
        listBubbleRemove.push(bubble);
        while (queue.length() > 0) {
            var element = queue.peek();
            var neighbor = findNeighbor(this.list_bubble, element.c, element.r)
            for (let i = 0; i < neighbor.length; i++) {
                if (neighbor[i].color == bubble.color && !isInArray(listBubbleRemove, neighbor[i])) {
                    queue.enqueue(neighbor[i])
                    listBubbleRemove.push(neighbor[i]);
                }
            }
            queue.dequeue();
        }
        this.removeListBubble(listBubbleRemove);
        this.removeFloatBubble();
    }

    removeFloatBubble() {
        var listRemoveBubble = [];
        for (var i = 0; i < this.list_bubble.length; i++) {
            if (checkFloatBubble(this.list_bubble, this.list_bubble[i]) == false) {
                this.list_bubble[i].vy = randomInRange(3, 5);
            }
        }
        console.log(this.list_bubble.length);
    }

    removeListBubble(list_bubbleRemove) {
        for (var i = 0; i < list_bubbleRemove.length; i++) {
            var index = this.list_bubble.indexOf(list_bubbleRemove[i]);
            if (index > -1) {
                this.list_bubble.splice(index, 1);
                this.removeChild(list_bubbleRemove[i]);
            }
        }
    }

    update(delta) {
        for (var i = 0; i < this.list_bubble.length; i++) {
            this.list_bubble[i].update(delta);
            if (this.list_bubble[i].y > GAME_HEIGHT) {
                console.log(this.list_bubble[i].y, GAME_HEIGHT);
                var index = this.list_bubble.indexOf(this.list_bubble[i]);
                if (index > -1) {
                    this.list_bubble.splice(index, 1);
                    this.removeChild(this.list_bubble[i]);

                }
            }
        }
    }
}