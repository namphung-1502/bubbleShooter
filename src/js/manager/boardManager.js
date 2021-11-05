import { Container, Loader, Graphics } from "pixi.js";
import { Bubble, BubbleEvent } from "../model/bubble";
import { findNeighbor, isInArray, checkFloatBubble, randomInRange, getBubbleCoordinate, getNewPositionBubble, randomElementInArray, checkColorBubble } from "../utils";
import Queue from "../model/queue";
import { BALL_WIDTH, GAME_HEIGHT, GAME_WIDTH, LINE_WIDTH, PADDING_BOT, PADDING_TOP } from "../constant.js";
import SpriteObject from "../model/spriteObject";
import Letter from "../model/letter";
import { BubbleManagerEvent } from "./bubbleManager";
import { MenuManagerEvent } from "./menuManager";
import * as TWEEN from '@tweenjs/tween.js'
const resources = Loader.shared.resources;
export const BoardManagerEvent = Object.freeze({
    RemoveChild: "boardmanager:removechild",
    AddChild: "boardmanager:addchild",
    AddEffect: "boardmanager:addeffect",
    BombEffect: "boardmanager:bombeffect",
    SpecialBallEffect: "boardmanager:specialballeffect",
    onClear: "boardmanager:onclear",
    DeadBubble: "boardmanager:deadbubble",
    SpecialBallShoot: "boardmanager:specialballshoot",
    AddBombItem: "boardmanager:addbombitem",
    AddSpecialBallItem: "boardmanager:addspecialballitem",
    ClearEffect: "boardmanager:cleareffect"
})
export default class BoardManager extends Container {
    constructor(list_bubble, level) {
        super();
        this.list_bubble = list_bubble;
        this.level = level;
        this.numBombItem = 1;
        this.numSpecialBallItem = 1;
        this.numBubbleToAdd = 22;
        this.clusterForBubble = [{
                "name": "Level 1",
                "randomNumber": 4,
                "cluster": [4, 5, 6],
                "arrayColorBubble": ["red", "blue", "yellow", "green", "pink"]
            },
            {
                "name": "Level 2",
                "randomNumber": 6,
                "cluster": [3, 4, 5],
                "arrayColorBubble": ["red", "blue", "yellow", "green", "pink", "lightblue"]
            },
            {
                "name": "Level 3",
                "randomNumber": 8,
                "cluster": [1, 2, 3],
                "arrayColorBubble": ["red", "blue", "yellow", "green", "pink", "lightblue", "transparent"]
            }
        ]
        this.addRowOfBubble = false;
        this.sendRequestClearBoard = false;
        this.onFailLevel = false;
        this.shooting = false;
        this.neighborRemoveBubble = [];
        this.checkCluster();
        this._initMap();
        this._initItem();

    }
    _initMap() {
        for (let i = 0; i < this.list_bubble.length; i++) {
            this.list_bubble[i].on(BubbleEvent.NeedRemove, this.removeBubble, this)
            this.addChild(this.list_bubble[i]);
        }

        this.line = new Graphics();
        this.line.lineStyle({
            width: LINE_WIDTH,
            color: 0x003f7f,
            alpha: 1
        });
        this.line.moveTo(0, PADDING_TOP);
        this.line.lineTo(GAME_WIDTH, PADDING_TOP);
        this.addChild(this.line);

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

    checkCluster() {
        for (var i = 0; i < this.clusterForBubble.length; i++) {
            if (this.clusterForBubble[i].name === this.level) {
                this.cluster = this.clusterForBubble[i];
            }
        }
    }

    lockBubble() {
        this.emit(BubbleManagerEvent.LockBubble, this);
    }

    unLockBubble() {
        this.emit(BubbleManagerEvent.UnlockBubble, this);
    }

    addBombItem() {
        this.numBombItem += 1;
    }
    addSpecialBallItem() {
        this.numSpecialBallItem += 1;
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
                    this.onFailLevel = true;
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
            this.effectBomb();


        }
        this.shooting = true;
        this.emit(BubbleManagerEvent.RemoveRootBubble, this);

    }

    effectBomb() {
        var position = { x: this.x, y: this.y };
        var newPosition = { x: this.x - 3, y: this.y };
        var tween = new TWEEN.Tween(position);
        tween.to(newPosition, 50)
            .onUpdate((pos) => {
                this.x = pos.x;
                this.y = pos.y;
            }).onComplete(() => {
                var position = { x: this.x, y: this.y };
                var newPosition = { x: this.x, y: this.y - 3 };
                var tween = new TWEEN.Tween(position);
                tween.to(newPosition, 50)
                    .onUpdate((pos) => {
                        this.x = pos.x;
                        this.y = pos.y;
                    }).onComplete(() => {
                        var position = { x: this.x, y: this.y };
                        var newPosition = { x: this.x + 3, y: this.y + 3 };
                        var tween = new TWEEN.Tween(position);
                        tween.to(newPosition, 50)
                            .onUpdate((pos) => {
                                this.x = pos.x;
                                this.y = pos.y;
                            }).start();
                    }).start();
            }).start();
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
        this.shooting = true;
        this.emit(BubbleManagerEvent.RemoveRootBubble, this);
    }

    addBubbleOnTop(bubble) {
        var r = 0;
        var c = Math.round(bubble.x / BALL_WIDTH);
        var newBubble = new Bubble(bubble.texture, r, c, bubble.color);
        newBubble = getBubbleCoordinate(newBubble, r, c);
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
                } else if (!isInArray(this.neighborRemoveBubble, neighbor[i])) {
                    this.neighborRemoveBubble.push(neighbor[i]);
                }
            }
            queue.dequeue();
        }
        return listBubbleRemove;
    }

    removeBubble(bubble) {
        var listRemove = this.getListToRemove(bubble);
        for (var i = 0; i < listRemove.length; i++) {
            this.emit(BoardManagerEvent.AddEffect, { x: listRemove[i].center_x, y: listRemove[i].center_y });
        }
        this.removeListBubble(listRemove);
        this.removeFloatBubble();
        this.effectBubbleCollision(bubble.c);
        this.shooting = true;
        this.emit(BubbleManagerEvent.RemoveRootBubble, this);
    }

    removeFloatBubble() {
        for (var i = 0; i < this.list_bubble.length; i++) {
            if (checkFloatBubble(this.list_bubble, this.list_bubble[i]) == false) {
                this.list_bubble[i].vy = randomInRange(1, 2);
                this.list_bubble[i].setDead();
            }
        }
    }

    removeDeadBubble(list_bubble) {
        var result = [];
        for (var i = 0; i < list_bubble.length; i++) {
            if (list_bubble[i].dead == false) {
                result.push(list_bubble[i]);
            }
        }
        return result;
    }
    effectBubbleCollision(column) {
        this.neighborRemoveBubble = this.removeDeadBubble(this.neighborRemoveBubble);
        for (var i = 0; i < this.neighborRemoveBubble.length; i++) {
            var bubble = this.neighborRemoveBubble[i];
            if (bubble.r != 0) {
                if (bubble.c > column)
                    this.setTweenRightBubble(bubble)
                else
                    this.setTweenLeftBubble(bubble)
            }

        }
        this.neighborRemoveBubble = [];
    }
    removeListBubble(list_bubbleRemove) {
        for (var i = 0; i < list_bubbleRemove.length; i++) {
            var index = this.list_bubble.indexOf(list_bubbleRemove[i]);
            if (index > -1) {
                this.list_bubble.splice(index, 1);
                this.removeChild(list_bubbleRemove[i]);
            }
        }
        this.emit(MenuManagerEvent.UpdateScore, list_bubbleRemove.length);
        this.removeFloatBubble();
    }
    updateBoard() {
        this.createBallInBoard();
        for (var i = 0; i < this.list_bubble.length; i++) {
            var bubble = this.list_bubble[i];
            var currentPosition = { x: bubble.x, y: bubble.y }
            var newPosition = getNewPositionBubble(bubble.c, bubble.r);
            this.setObjectTween(currentPosition, newPosition, bubble);
        }
    }

    createBallInBoard() {
        let numBubbleOfRow = 10;
        let numOfRow = -2;
        let numOfColumn = 0;
        var numBubbleAdded = 0;
        for (var i = 0; i < this.cluster.randomNumber; i++) {
            if (numBubbleAdded == 22)
                break;
            if (i == this.cluster.randomNumber - 1)
                var numBubbleOfCluster = 22 - numBubbleAdded;
            else
                var numBubbleOfCluster = randomElementInArray(this.cluster.cluster);
            var color = randomElementInArray(this.cluster.arrayColorBubble);
            var textureColor = checkColorBubble(color);
            numBubbleAdded += numBubbleOfCluster;
            for (var j = 0; j < numBubbleOfCluster; j++) {
                if (numOfColumn > numBubbleOfRow) {
                    numOfRow += 1;
                    numOfColumn = 0;
                }
                var bubble = new Bubble(textureColor, numOfRow, numOfColumn, color);
                var position = getBubbleCoordinate(bubble, numOfRow, numOfColumn);
                bubble.setPosition(position.x, position.y);
                this.list_bubble.push(bubble);
                numOfColumn += 1;

            }
        }
    }

    setObjectTween(currentPosition, newPosition, target) {
        var tween = new TWEEN.Tween(currentPosition);
        tween.to(newPosition, 750)
            .onUpdate((pos) => {
                target.x = pos.x;
                target.y = pos.y;
            }).onComplete((pos) => {
                target.setPosition(newPosition.x, newPosition.y);
                target.r = target.r + 2;
            }).start();
    }

    vibrateBubbleWhenBomb(target) {
        var position = { x: target.x, y: target.y };
        var newPosition = { x: target.x - 2, y: target.y };
        var tween = new TWEEN.Tween(position);
        tween.to(newPosition, 100)
            .onUpdate((pos) => {
                target.x = pos.x;
                target.y = pos.y;
            }).onComplete(() => {
                var position = { x: target.x, y: target.y };
                var newPosition = { x: target.x, y: target.y + 4 };
                var tween = new TWEEN.Tween(position);
                tween.to(newPosition, 100)
                    .onUpdate((pos) => {
                        target.x = pos.x;
                        target.y = pos.y;
                    }).start();
            }).start();
    }

    setTweenLeftBubble(target) {
        var position = { x: target.x, y: target.y };
        var newPosition = { x: target.x - 2, y: target.y - 2 };
        var tween = new TWEEN.Tween(position);
        tween.to(newPosition, 100)
            .onUpdate((pos) => {
                target.x = pos.x;
                target.y = pos.y;
            }).onComplete(() => {
                var position = { x: target.x, y: target.y };
                var newPosition = { x: target.x + 2, y: target.y + 2 };
                var tween = new TWEEN.Tween(position);
                tween.to(newPosition, 100)
                    .onUpdate((pos) => {
                        target.x = pos.x;
                        target.y = pos.y;
                    }).start();
            }).start();
    }

    setTweenRightBubble(target) {
        var position = { x: target.x, y: target.y };
        var newPosition = { x: target.x + 2, y: target.y - 2 };
        var tween = new TWEEN.Tween(position);
        tween.to(newPosition, 100)
            .onUpdate((pos) => {
                target.x = pos.x;
                target.y = pos.y;
            }).onComplete(() => {
                var position = { x: target.x, y: target.y };
                var newPosition = { x: target.x - 2, y: target.y + 2 };
                var tween = new TWEEN.Tween(position);
                tween.to(newPosition, 100)
                    .onUpdate((pos) => {
                        target.x = pos.x;
                        target.y = pos.y;
                    }).start();
            }).start();
    }

    freeBall() {
        for (var i = 0; i < this.list_bubble.length; i++) {
            this.list_bubble[i].vy = randomInRange(3, 4);
        }
    }

    checkShooting() {
        for (var i = 0; i < this.list_bubble.length; i++) {
            var bubble = this.list_bubble[i];
            if (bubble.dead) {
                return false;
            }
        }
        return true;
    }


    update(delta) {
        TWEEN.update();
        this.countBombItem.setText(`x${this.numBombItem}`);
        this.countSpecialBallItem.setText(`x${this.numSpecialBallItem}`);
        this.needRemove = [];
        for (var i = 0; i < this.list_bubble.length; i++) {
            if (this.list_bubble[i].y < PADDING_TOP) {
                this.removeChild(this.list_bubble[i]);
            } else {
                this.addChild(this.list_bubble[i]);
            }
            this.list_bubble[i].update(delta);
            if (this.list_bubble[i].y > GAME_HEIGHT && !this.onFailLevel) {
                this.needRemove.push(this.list_bubble[i]);
            }
        }
        if (this.needRemove.length > 0) {
            this.removeListBubble(this.needRemove);
            this.needRemove = [];
        }
        if (this.list_bubble.length == 0 && this.sendRequestClearBoard == false) {
            this.emit(BoardManagerEvent.onClear, this.scoreNumber);
            this.sendRequestClearBoard = true;
        }

        if (this.list_bubble.length < 40 && !this.addRowOfBubble && !this.onFailLevel) {
            this.addRowOfBubble = true;
            setTimeout(() => {
                this.updateBoard();

            }, 150);
        }
        if (this.checkShooting()) {
            if (this.shooting) {
                this.emit(BubbleManagerEvent.ShootDone, this);
                this.shooting = false;
            }
        }
    }

}