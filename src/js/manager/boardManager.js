import { Container, Loader } from "pixi.js";
import { Bubble, BubbleEvent } from "../model/bubble";
import { findNeighbor, isInArray, checkFloatBubble, randomInRange, getBubbleCoordinate } from "../utils";
import Queue from "../model/queue";
import { BALL_WIDTH, GAME_HEIGHT, GAME_WIDTH, PADDING_BOT } from "../constant.js";
import SpriteObject from "../model/spriteObject";
import Letter from "../model/letter";
import { BubbleManagerEvent } from "./bubbleManager";
const resources = Loader.shared.resources;
export const BoardManagerEvent = Object.freeze({
    RemoveChild: "boardmanager:removechild",
    AddChild: "boardmanager:addchild",
    AddEffect: "boardmanager:addeffect",
    BombEffect: "boardmanager:bombeffect",
    onClear: "boardmanager:onclear",
    DeadBubble: "boardmanager:deadbubble",
    SpecialBallShoot: "boardmanager:specialballshoot"
})
export default class BoardManager extends Container {
    constructor(list_bubble) {
        super();
        this.list_bubble = list_bubble;
        this.numBombItem = 1;
        this.numSpecialBallItem = 1;
        this._initMap();
        this._initItem();


    }
    _initMap() {
        for (let i = 0; i < this.list_bubble.length; i++) {
            this.list_bubble[i].on(BubbleEvent.NeedRemove, this.removeBubble, this)
            this.addChild(this.list_bubble[i]);
        }
    }
    _initItem() {
        this.placeBombItem = new SpriteObject(resources["image/brick_purple.png"].texture);
        this.placeBombItem.x = GAME_WIDTH - 50;
        this.placeBombItem.y = GAME_HEIGHT - 80;
        this.addChild(this.placeBombItem);

        this.bombItem = new SpriteObject(resources["image/bomb.png"].texture);
        this.bombItem.setScale(0.9, 0.9);
        this.bombItem.x = GAME_WIDTH - 50;
        this.bombItem.y = GAME_HEIGHT - 80;
        this.addChild(this.bombItem);

        this.bombItem.interactive = true;
        this.bombItem.buttonMode = true;
        this.bombItem.on("mouseover", this.lockBubble, this);
        this.bombItem.on("mouseout", this.unLockBubble, this);
        this.bombItem.on("pointerdown", () => {
            if (this.numBombItem > 0) {
                this.emit(BubbleManagerEvent.BombItemActive, this);
                this.numBombItem -= 1;
            }

        });

        this.countBombItem = new Letter(`x${this.numBombItem}`, 16);
        this.countBombItem.x = this.bombItem.x + 20;
        this.countBombItem.y = this.bombItem.y + 50;
        this.addChild(this.countBombItem);


        this.placeSpecialBallItem = new SpriteObject(resources["image/brick_green.png"].texture);
        this.placeSpecialBallItem.x = GAME_WIDTH - 50;
        this.placeSpecialBallItem.y = GAME_HEIGHT - 150;
        this.addChild(this.placeSpecialBallItem);

        this.specialBallItem = new SpriteObject(resources["image/specialBall.png"].texture)
        this.specialBallItem.x = GAME_WIDTH - 47;
        this.specialBallItem.y = GAME_HEIGHT - 148;
        this.specialBallItem.setScale(0.8, 0.8);
        this.addChild(this.specialBallItem);
        this.specialBallItem.interactive = true;
        this.specialBallItem.buttonMode = true;
        this.specialBallItem.on("mouseover", this.lockBubble, this);
        this.specialBallItem.on("mouseout", this.unLockBubble, this);
        this.specialBallItem.on("pointerdown", () => {
            if (this.numSpecialBallItem > 0) {
                this.emit(BubbleManagerEvent.SpecialBallActive, this);
                this.numSpecialBallItem -= 1;
            }

        });

        this.countSpecialBallItem = new Letter(`x${this.numSpecialBallItem}`, 16);
        this.countSpecialBallItem.x = this.specialBallItem.x + 20;
        this.countSpecialBallItem.y = this.specialBallItem.y + 50;
        this.addChild(this.countSpecialBallItem);

    }

    lockBubble() {
        this.emit(BubbleManagerEvent.LockBubble, this);
    }

    unLockBubble() {
        this.emit(BubbleManagerEvent.UnlockBubble, this);
    }

    addBubble(bubble) {
        if (bubble.color != "black") {
            // true is remove bubble and false is add bubble
            var option = false;
            var listRemove = this.getListToRemove(bubble);
            if (listRemove.length > 2) {
                option = true;
            } else {
                option = false;
            }

            if (!option) {
                if (bubble.y < GAME_HEIGHT - PADDING_BOT - 2 * BALL_WIDTH) {
                    this.list_bubble.push(bubble);
                    this.addChild(bubble);
                } else {
                    this.emit(BoardManagerEvent.DeadBubble, this);
                }
            } else {
                this.removeBubble(bubble);
            }
        } else {
            let removeList = [];
            for (let i = 0; i < this.list_bubble.length; i++) {
                var bubbleCheck = this.list_bubble[i];
                if (bubbleCheck.center_x >= bubble.center_x - 100 && bubbleCheck.center_x <= bubble.center_x + 100 &&
                    bubbleCheck.center_y >= bubble.center_y - 100 && bubbleCheck.center_y <= bubble.center_y + 100) {
                    this.removeChild(bubbleCheck);
                    removeList.push(bubbleCheck)
                }
            }
            this.emit(BoardManagerEvent.BombEffect, { x: bubble.x, y: bubble.y });
            this.removeListBubble(removeList);

        }

    }

    specialBallShoot(bubble) {
        let removeList = [];
        for (let i = 0; i < this.list_bubble.length; i++) {
            var bubbleCheck = this.list_bubble[i];
            if (bubbleCheck.color == bubble.color) {
                this.removeChild(bubbleCheck);
                this.emit(BoardManagerEvent.AddEffect, { x: bubbleCheck.x, y: bubbleCheck.y });
                removeList.push(bubbleCheck)
            }
        }
        this.removeListBubble(removeList);
    }

    addBubbleOnTop(bubble) {
        var r = 0;
        var c = Math.round(bubble.x / BALL_WIDTH);
        var newBubble = new Bubble(bubble.texture, r, c, bubble.color);
        newBubble.setPosition(newBubble.x, newBubble.y);

        this.addBubble(newBubble);
    }

    getListToRemove(bubble) {
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
                    this.emit(BoardManagerEvent.AddEffect, { x: neighbor[i].center_x, y: neighbor[i].center_y });
                }
            }
            queue.dequeue();
        }
        return listBubbleRemove;
    }

    removeBubble(bubble) {
        var listRemove = this.getListToRemove(bubble);
        this.removeListBubble(listRemove);
        this.removeFloatBubble();
    }

    removeFloatBubble() {
        for (var i = 0; i < this.list_bubble.length; i++) {
            if (checkFloatBubble(this.list_bubble, this.list_bubble[i]) == false) {
                this.list_bubble[i].vy = randomInRange(4, 5);
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
        this.removeFloatBubble();
    }

    update(delta) {
        this.countBombItem.setText(`x${this.numBombItem}`);
        this.countSpecialBallItem.setText(`x${this.numSpecialBallItem}`);
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
        if (this.list_bubble.length == 0) {
            this.emit(BoardManagerEvent.onClear, this.scoreNumber);
        }
    }

}