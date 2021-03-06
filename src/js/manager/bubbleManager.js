import * as TWEEN from '@tweenjs/tween.js'
import { Container, Loader, Graphics } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT, BUBBLE_RADIUS, ITEM_BAR_HEIGHT, PADDING_TOP } from '../constant'
import LineGuide from '../model/lineGuide';
import { calculator_angle, checkColorGuideLine, checkElementInList, randomElementInArray } from '../utils.js';
import Letter from '../model/letter';
import { rootBubble } from '../model/rootBubble';
import { BoardManagerEvent } from './boardManager';
import SpriteObject from '../model/spriteObject';

const resources = Loader.shared.resources;

export const BubbleManagerEvent = Object.freeze({
    ShootDone: "bubblemanager:shootdone",
    RootBubbleOnTop: "bubblemanager:rootbubbleontop",
    OutOfBubble: "bubblemanage:outofbubble",
    UnlockBubble: "bubblemanager:unlockbubble",
    LockBubble: "bubblemanager:lockbubble",
    BombItemActive: "bubblemanager:bombitemactive",
    FireItemActive: "bubblemanager:fiveitemactive",
    SpecialBallActive: "bubblemanager:specialballactive",
    RemoveRootBubble: "bubblemanager:removerootbubble"
})

export default class bubbleManager extends Container {
    constructor(list_rootBubble, list_bubble) {
        super();
        this.list_bubble = list_rootBubble;
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this.currentShootBubble = 0;
        this.bubbleList = list_bubble;
        this.listColorBubble = ["blue", "red", "yellow", "lightblue", "green", "pink", "transparent"];
        this.bombItem = false;
        this.specialBall = false;
        this._renderRootBubble();
        this._renderTextOfNumberBubble();
        this._initLineGuide(90);
        this.interactive = true;
        this.on("mousemove", this.handleMouseMove, this);
        this.lockGuideLine = false;
        this.specialBallEffect = false;
        this.onFailLevel = false;



    }
    handleMouseMove(e) {
        if (this.lockGuideLine == false) {
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
    }

    _renderRootBubble() {
        if (this.list_bubble.length > 0) {
            this.shootBubble = this.list_bubble[this.currentShootBubble];
            if (!checkElementInList(this.listColorBubble, this.shootBubble.color) && !this.bombItem && !this.specialBall) {
                var color = randomElementInArray(this.listColorBubble);
                this.shootBubble.changeColor(color);
            }
            this.shootBubble.setPosition(GAME_WIDTH / 2 - BUBBLE_RADIUS, GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS - ITEM_BAR_HEIGHT);
            this.addChild(this.shootBubble);
            this.lineGuideColor = checkColorGuideLine(this.shootBubble.color);
            if (this.list_bubble.length > 1) {
                this.prepareShootBubble = this.list_bubble[this.currentShootBubble + 1];
                this.prepareShootBubble.setPosition(this.shootBubble.x - 100, this.shootBubble.y + 20);
                this.addChild(this.prepareShootBubble);
            }

        }
        if (!this.bombItem && !this.specialBall)
            this.emit(BubbleManagerEvent.UnlockBubble, this);

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
    shootDone() {
        var position = { x: this.prepareShootBubble.x, y: this.prepareShootBubble.y };
        var newPosition = { x: GAME_WIDTH / 2 - BUBBLE_RADIUS, y: GAME_HEIGHT - PADDING_BOT - BUBBLE_RADIUS - ITEM_BAR_HEIGHT };
        var tween = new TWEEN.Tween(position)
            .to(newPosition, 300)
            .onUpdate((pos) => {
                this.prepareShootBubble.x = pos.x;
                this.prepareShootBubble.y = pos.y;
                if (this.prepareShootBubble.x === newPosition.x && this.prepareShootBubble.y === newPosition.y) {
                    this._renderRootBubble();
                }
            });
        tween.start();
    }

    shoot(x, y) {
        this.shootBubble.calcuVelocity(x, y);
        this.lockBubble = true;
        this.lockGuideLine = true;
        this.emit(BubbleManagerEvent.LockBubble, this);
        this.lineGuide.visible = false;
    }

    removeRootBubble() {
        this.removeChild(this.list_bubble[0]);
        this.list_bubble.splice(0, 1);
        this.lockGuideLine = false;
        this.lineGuide.visible = true;
        this.specialBallEffect = false;
        this.bombItem = false;

        if (this.specialBall) {
            this.trail.visible = false;
        }
        this.specialBall = false;
    }

    itemBombActive() {
        if (!this.specialBall) {
            var bombItem = new rootBubble(0, 0, resources["image/bomb.png"].texture, "black", true, false);
            this.list_bubble.unshift(bombItem);
            this.bombItem = true;
            this._renderRootBubble();
        }
    }

    itemSpecialBallActive() {
        if (!this.bombItem) {
            var specialBall = new rootBubble(0, 0, resources["image/specialBall.png"].texture, "0xbfbf00", false, true);
            this.list_bubble.unshift(specialBall);
            this.specialBall = true;
            this._renderRootBubble();
            this.specialBallEffect = true;
            this.trail = new SpriteObject(resources["image/trail1.png"].texture);
            this.trail.anchor.set(0.5, 0.5);
            this.addChild(this.trail);
        }

    }

    getColorBubble() {
        this.listColorBubble = [];
        for (var i = 0; i < this.bubbleList.length; i++) {
            var bubble = this.bubbleList[i];
            if (!bubble.dead && !checkElementInList(this.listColorBubble, bubble.color)) {
                this.listColorBubble.push(bubble.color);
            }
        }
    }
    drawGraphics(x1, y1, x2, y2) {
        this.line = new Graphics();
        this.line.lineStyle({ width: 4, color: 0xFFFFFF, alpha: 1 });
        this.line.moveTo(x1, y1);
        this.line.lineTo(x2, y2);
        this.addChild(this.line);
    }
    update(delta) {
        TWEEN.update();
        this.getColorBubble();
        this.shootBubble.update(delta);
        //this.drawGraphics(this.shootBubble.center_x, this.shootBubble.center_y, this.shootBubble.lineX, this.shootBubble.lineY);
        if (this.list_bubble.length > 1) {
            this.prepareShootBubble.update(delta);
        }
        this.numberBubble.setText(`x${this.list_bubble.length-1}`)
        if (this.shootBubble.center_y - BUBBLE_RADIUS < PADDING_TOP) {
            this.shootBubble.stop();
            this.emit(BubbleManagerEvent.RootBubbleOnTop, this.shootBubble);
        }
        if (this.specialBallEffect) {
            if (this.shootBubble.vx == 0) {
                this.trail.x = this.shootBubble.center_x;
                this.trail.y = this.shootBubble.center_y + this.trail.height;
                this.trail.rotation = Math.PI + 0.2;
            } else {
                this.trail.x = this.shootBubble.center_x - (this.shootBubble.vx * 5);
                this.trail.y = this.shootBubble.center_y - (this.shootBubble.vy * 5);
                this.trail.rotation = this.shootBubble.radToRotation + 0.1;
            }
            this.emit(BoardManagerEvent.SpecialBallEffect, { x: this.shootBubble.center_x, y: this.shootBubble.center_y });
        }
        if (this.list_bubble.length < 1 && !this.onFailLevel) {
            this.emit(BubbleManagerEvent.OutOfBubble, this);
            this.onFailLevel = true;
        }
    }
}