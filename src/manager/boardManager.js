import { Container } from "pixi.js";
import { Bubble, BubbleEvent } from "../js/model/bubble";
import { findNeighbor, isInArray, checkFloatBubble, randomInRange, getBubbleCoordinate } from "../js/utils";
import Queue from "../js/model/Queue";
import { BALL_WIDTH, BALL_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS } from "../js/constant.js";

export const BoardManagerEvent = Object.freeze({
    RemoveChild: "boardmanager:removechild",
    AddChild: "boardmanager:addchild",
    onClear: "boardmanager:onclear"
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
        var neighBor = findNeighbor(this.list_bubble, bubble.c, bubble.r);
        // true is remove bubble and false is add bubble
        var option = false;
        if (neighBor.length > 0) {
            for (var i = 0; i < neighBor.length; i++) {
                if (neighBor[i].color == bubble.color) {
                    option = true;
                    break;
                }
            }

        } else {
            option = false;
        }

        // console.log(option);
        if (!option) {
            this.list_bubble.push(bubble);
            this.addChild(bubble);
        } else {
            this.removeBubble(bubble);
        }

    }

    addBubbleOnTop(bubble) {
        // console.log(bubble);
        var r = 0;
        var c = Math.floor(bubble.x / BALL_WIDTH);
        var newBubble = new Bubble(bubble.texture, r, c, bubble.color);
        var temp = getBubbleCoordinate(newBubble, newBubble.r, newBubble.c);
        newBubble.setPosition(newBubble.x, newBubble.y);

        this.addBubble(newBubble);
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
        for (var i = 0; i < this.list_bubble.length; i++) {
            if (checkFloatBubble(this.list_bubble, this.list_bubble[i]) == false) {
                this.list_bubble[i].vy = randomInRange(3, 5);
            }
        }
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
        this.needRemove = [];
        for (var i = 0; i < this.list_bubble.length; i++) {
            this.list_bubble[i].update(delta);
            if (this.list_bubble[i].y > GAME_HEIGHT) {
                this.needRemove.push(this.list_bubble[i]);
            }
        }
        if (this.needRemove.length > 0) {
            this.removeListBubble(this.needRemove);
            this.needRemove = [];
        }
    }

}