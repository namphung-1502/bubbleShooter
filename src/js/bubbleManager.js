import { Container } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT } from './constant'
export default class bubbleManager extends Container {
    constructor(list_bubble) {
        super();
        this.list_bubble = list_bubble;
        this._initRootBubble();
    }

    _initRootBubble() {
        this.shootBubble = this.list_bubble[0];
        this.shootBubble.setPosition(GAME_WIDTH / 2 - this.shootBubble.width / 2, GAME_HEIGHT - PADDING_BOT);
        this.addChild(this.shootBubble);
    }
}