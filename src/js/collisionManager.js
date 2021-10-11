import { utils } from "pixi.js";
import circleCollider from "../../circleCollider";
export const CollisionManagerEvent = Object.freeze({
    Colliding: "collisionManager: colliding"
})

export default class CollisionManager extends utils.EventEmitter {
    constructor(list_rootBubble, listBubble) {
        super();
        this.list_rootBubble = list_rootBubble;
        this.listBubble = listBubble;
        for (var i = 0; i < this.list_rootBubble.length; i++) {
            if (this.list_rootBubble[i].collider.detectCircleCollision(this.list_rootBubble[i].center_x, this.list_rootBubble[1].center_y, this.listBubble[1].center_x, this.listBubble[0].center_y)) {
                console.log(this.list_rootBubble[i].center_x, this.list_rootBubble[i].center_y, this.list_rootBubble[0].center_x, this.list_rootBubble[0].center_y);
            }
        }
    }
    remove() {

    }

    update() {
        for (let i = 0; i < this.list_rootBubble.length; i++) {
            var obj1 = this.list_rootBubble[i];
            for (let j = 0; j < this.listBubble.length; j++) {
                var obj2 = this.listBubble[j];
                if (this.list_rootBubble[i].collider.detectCircleCollision(this.list_rootBubble[i].center_x, this.list_rootBubble[i].center_y, this.listBubble[j].center_x, this.listBubble[j].center_y)) {

                }
            }
        }
    }

}