import { utils } from "pixi.js";
import circleCollider from "../../circleCollider";
import { BoardManagerEvent } from "./boardManager";
import { BubbleEvent, Bubble } from "./bubble";
import { getBubbleCoordinate } from "./utils";
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
    remove(rootBubble) {
        var index = this.list_rootBubble.indexOf(rootBubble);
        this.list_rootBubble.splice(index, 1);
    }

    addBubble(rootbubble, bubble) {

        var c = bubble.c;
        var r = bubble.r;
        console.log(c, r);
        let newBubble = new Bubble(rootbubble.texture, r + 1, c, rootbubble.color);
        this.listBubble.push(newBubble);

        var index = this.list_rootBubble.indexOf(rootbubble);
        this.list_rootBubble.splice(index, 1);

        var temp = getBubbleCoordinate(newBubble, newBubble.r, newBubble.c);
        newBubble.setPosition(temp.x, temp.y);

        this.emit(BoardManagerEvent.AddChild, newBubble);
        this.emit(BubbleManagerEvent.ShootDone, rootbubble);
    }

    update() {
        for (let i = 0; i < this.list_rootBubble.length; i++) {
            var rootBubble = this.list_rootBubble[i];
            for (let j = 0; j < this.listBubble.length; j++) {
                var bubble = this.listBubble[j];
                if (rootBubble.collider.detectCircleCollision(rootBubble.center_x, rootBubble.center_y, bubble.center_x, bubble.center_y)) {
                    if (rootBubble.color == rootBubble.color) {
                        rootBubble.stop();
                        this.remove(rootBubble);
                        this.addBubble(rootBubble, bubble);
                    }
                }
            }
        }
    }
}