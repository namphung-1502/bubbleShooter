import * as TWEEN from '@tweenjs/tween.js'
import { Container, Loader } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS, ITEM_BAR_HEIGHT } from '../constant'
import LineGuide from '../model/lineGuide';
import { calculator_angle, checkColorGuideLine } from '../utils.js';
import Letter from '../model/letter';
import { rootBubble } from '../model/rootBubble';

const resources = Loader.shared.resources;

export const BubbleManagerEvent = Object.freeze({
    ShootDone: "bubblemanager:shootdone",
    RootBubbleOnTop: "bubblemanager:rootbubbleontop",
    OutOfBubble: "bubblemanage:outofbubble",
    UnlockBubble: "bubblemanager:unlockbubble",
    LockBubble: "bubblemanager:lockbubble",
    BombItemActive: "bubblemanager:bombitemactive",
    FireItemActive: "bubblemanager:fiveitemactive",
    SpecialBallActive: "bubblemanager:specialballactive"
})

export default class bubbleManager extends Container {
    constructor(list_rootBubble, list_bubble) {
        super();
        this.list_bubble = list_rootBubble;
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this.currentShootBubble = 0;
        this.bubbleList = list_bubble;
        this._renderRootBubble();
        this._renderTextOfNumberBubble();
        this._initLineGuide(90);
        this.interactive = true;
        this.on("mousemove", this.handleMouseMove, this);
        this.lockBubble = false;
    }
    handleMouseMove(e) {
        var pos = e.data.global;
        if (Math.round(pos.x) >= 0 && Math.round(pos.x) <= GAME_WIDTH && Math.round(pos.y) >= 0 && Math.round(pos.y) <= GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS) {
            this.lineGuide.setDestroy();
            var x2 = pos.x;
            var y2 = pos.y;
            var x1 = GAME_WIDTH / 2,
                x3 = GAME_WIDTH / 2;
            var y1 = GAME_HEIGHT - PADDING_BOT - ITEM_BAR_HEIGHT,
                y3 = GAME_HEIGHT - PADDING_BOT - ITEM_BAR_HEIGHT,
                y4 = GAME_HEIGHT - PADDING_BOT - ITEM_BAR_HEIGHT;
            var x4 = GAME_WIDTH / 2 * 1 / 3;
            var angle = calculator_angle(x1, x2, x3, x4, y1, y2, y3, y4);
            this._initLineGuide(angle);
        }
    }

    _renderRootBubble() {
        if (this.list_bubble.length > 0) {
            this.shootBubble = this.list_bubble[this.currentShootBubble];
            this.shootBubble.setPosition(GAME_WIDTH / 2 - BUBBLE_RADIUS, GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS - ITEM_BAR_HEIGHT);
            this.addChild(this.shootBubble);
            this.lineGuideColor = checkColorGuideLine(this.shootBubble.color);
            if (this.list_bubble.length > 1) {
                this.prepareShootBubble = this.list_bubble[this.currentShootBubble + 1];
                this.prepareShootBubble.setPosition(this.shootBubble.x - 100, this.shootBubble.y + 20);
                this.addChild(this.prepareShootBubble);
            }

        }

    }
    _initLineGuide(angle) {
        this.lineGuide = new LineGuide(this.lineGuideColor, this.bubbleList);
        this.lineGuide.draw(angle);
        this.addChild(this.lineGuide);
    }
    _renderTextOfNumberBubble() {
        this.numberBubble = this.list_bubble.length - 1;
        this.numberBubble = new Letter(`x${this.numberBubble}`, 15);
        this.numberBubble.x = this.prepareShootBubble.x - 20;
        this.numberBubble.y = this.prepareShootBubble.y + BUBBLE_RADIUS;
        this.addChild(this.numberBubble);
    }
    shootDone(rootBubble) {
        this.removeChild(rootBubble);
        var index = this.list_bubble.indexOf(rootBubble);
        this.list_bubble.splice(index, 1);
        var position = { x: this.prepareShootBubble.x, y: this.prepareShootBubble.y };
        var newPosition = { x: GAME_WIDTH / 2 - BUBBLE_RADIUS, y: GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS - ITEM_BAR_HEIGHT };
        var tween = new TWEEN.Tween(position)
            .to(newPosition, 300)
            .onUpdate((pos) => {
                this.prepareShootBubble.x = pos.x;
                this.prepareShootBubble.y = pos.y;
                if (this.prepareShootBubble.x === newPosition.x && this.prepareShootBubble.y === newPosition.y) {
                    this._renderRootBubble();
                    this.emit(BubbleManagerEvent.UnlockBubble, this);
                }
            });
        tween.start();
    }

    shoot(x, y) {
        this.shootBubble.calcuVelocity(x, y);
        this.lockBubble = true;
    }

    itemBombActive() {
        var bombItem = new rootBubble(0, 0, resources["image/bomb.png"].texture, "black", true, false);
        this.list_bubble.unshift(bombItem);
        this._renderRootBubble();
    }

    itemSpecialBallActive() {
        var specialBall = new rootBubble(0, 0, resources["image/specialBall.png"].texture, "0xbfbf00", false, true);
        this.list_bubble.unshift(specialBall);
        this._renderRootBubble();
    }
    update(delta) {
        TWEEN.update();
        this.shootBubble.update(delta);
        if (this.list_bubble.length > 1) {
            this.prepareShootBubble.update(delta);
        }
        this.numberBubble.setText(`x${this.list_bubble.length-1}`)
        if (this.shootBubble.center_y - BUBBLE_RADIUS < 0) {
            this.shootBubble.stop();
            this.emit(BubbleManagerEvent.RootBubbleOnTop, this.shootBubble);
            this.shootDone(this.shootBubble);
        }
        if (this.list_bubble.length < 1) {

            this.emit(BubbleManagerEvent.OutOfBubble, this);
        }


    }
}