import { utils } from "pixi.js";
import circleCollider from "../../circleCollider";
import { BoardManagerEvent } from "./boardManager";
import { BubbleEvent, Bubble } from "./bubble";
import { getBubbleCoordinate, checkBubbleOnGrid } from "./utils";
import { BubbleManagerEvent } from "./bubbleManager";
import { BUBBLE_RADIUS } from "./constant";
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

    }

    update() {
        for (let i = 0; i < this.list_rootBubble.length; i++) {
            var rootBubble = this.list_rootBubble[i];
            for (let j = 0; j < this.listBubble.length; j++) {
                var bubble = this.listBubble[j];
                if (rootBubble.collider.detectCircleCollision(rootBubble.center_x, rootBubble.center_y, bubble.center_x, bubble.center_y)) {
                    rootBubble.stop();
                    if (rootBubble.color != bubble.color) {
                        this.addBubble(rootBubble, bubble);
                    } else if (rootBubble.color == bubble.color) {
                        this.removeBubble(rootBubble, bubble);
                    }
                    return;
                }
            }
        }
    }
}

// sau khi xóa thì tìm đường của tất cả các quả bóng bên cạnh, cái nào có dudowgnf lên thì oke, ko thì xóa
// dùng thuật toán a* or deep first search để tìm đường