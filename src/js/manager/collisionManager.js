import { utils } from "pixi.js";
import { BoardManagerEvent } from "./boardManager";
import { Bubble } from "../model/bubble";
import { getBubbleCoordinate, checkBubbleOnGrid, countNeighborSameColor } from "../utils.js";
import { BubbleManagerEvent } from "./bubbleManager";
export const CollisionManagerEvent = Object.freeze({
    Colliding: "collisionManager: colliding"
})

export default class CollisionManager extends utils.EventEmitter {
    constructor(list_rootBubble, listBubble) {
        super();
        this.list_rootBubble = list_rootBubble;
        this.listBubble = listBubble;
    }

    addBubble(rootbubble, bubble) {
        var c = bubble.c;
        var r = bubble.r;
        if (rootbubble.center_x > bubble.center_x) {
            if (rootbubble.center_x - bubble.center_x > 20) {
                if (checkBubbleOnGrid(this.listBubble, c + 1, r)) {
                    if (r % 2 != 0) {
                        c = c + 1;
                    }
                    r = r + 1;
                } else {
                    c = c + 1;
                }
            } else {
                if (r % 2 != 0) {
                    c = c + 1;
                }
                r = r + 1;
            }
        } else {
            if (bubble.center_x - rootbubble.center_x > 20) {
                if (checkBubbleOnGrid(this.listBubble, c - 1, r)) {
                    if (r % 2 == 0) {
                        c = c - 1;
                    }
                    r = r + 1;
                } else {
                    c = c - 1;
                }
            } else {
                if (r % 2 == 0) {
                    c = c - 1;
                }
                r = r + 1;
            }

        }
        let newBubble = new Bubble(rootbubble.texture, r, c, rootbubble.color);
        var temp = getBubbleCoordinate(newBubble, newBubble.r, newBubble.c);
        newBubble.setPosition(temp.x, temp.y);
        this.emit(BoardManagerEvent.AddChild, newBubble);
        this.emit(BubbleManagerEvent.ShootDone, rootbubble);
    }
    removeBubble(rootBubble, bubble) {
        this.emit(BoardManagerEvent.RemoveChild, bubble);
        this.emit(BubbleManagerEvent.ShootDone, rootBubble);
    }

    update() {
        for (let i = 0; i < this.list_rootBubble.length; i++) {
            var rootBubble = this.list_rootBubble[i];
            for (let j = 0; j < this.listBubble.length; j++) {
                var bubble = this.listBubble[j];
                if (rootBubble.collider.detectCircleCollision(rootBubble.center_x, rootBubble.center_y, bubble.center_x, bubble.center_y)) {
                    rootBubble.stop();
                    if (rootBubble.color != bubble.color) {
                        if (rootBubble.color == "0xbfbf00") {
                            this.emit(BoardManagerEvent.SpecialBallShoot, bubble);
                            this.emit(BubbleManagerEvent.ShootDone, rootBubble);
                        } else {
                            this.addBubble(rootBubble, bubble);
                        }

                    } else if (rootBubble.color == bubble.color) {
                        var number = countNeighborSameColor(this.listBubble, bubble);

                        if (number > 0) {
                            this.removeBubble(rootBubble, bubble);
                        } else if (number <= 0) {
                            this.addBubble(rootBubble, bubble);
                        }
                    }

                    return;
                }
            }
        }
    }
}