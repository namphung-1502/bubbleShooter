import { Container } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS } from './constant'
import LineGuide from './LineGuide';
import { radToDeg, calculator_angle } from './utils';
export default class bubbleManager extends Container {
    constructor(list_bubble) {
        super();
        this.list_bubble = list_bubble;
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this._initRootBubble();
        this._initLineGuide(90);
        this.interactive = true;
        this.on("mousemove", this.handleMouseMove);
    }
    handleMouseMove(e) {
        var pos = e.data.global;
        if (Math.round(pos.x) >= 0 && Math.round(pos.x) <= GAME_WIDTH && Math.round(pos.y) >= 0 && Math.round(pos.y) <= GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS) {
            this.lineGuide.setDestroy();
            var x2 = pos.x;
            var y2 = pos.y;
            var x1 = GAME_WIDTH / 2,
                x3 = GAME_WIDTH / 2;
            var y1 = GAME_HEIGHT - PADDING_BOT,
                y3 = GAME_HEIGHT - PADDING_BOT,
                y4 = GAME_HEIGHT - PADDING_BOT;
            var x4 = GAME_WIDTH / 2 * 1 / 3;
            var angle = calculator_angle(x1, x2, x3, x4, y1, y2, y3, y4);
            console.log(180 - angle);
            this._initLineGuide(180 - angle);
        }

    }

    _initRootBubble() {
        this.shootBubble = this.list_bubble[0];
        this.shootBubble.setPosition(GAME_WIDTH / 2 - BUBBLE_RADIUS, GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS);
        this.addChild(this.shootBubble);
    }
    _initLineGuide(angle) {
        this.lineGuide = new LineGuide();
        this.lineGuide.draw(angle);
        this.addChild(this.lineGuide);
    }

}