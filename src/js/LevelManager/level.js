import { Container, Loader } from "pixi.js";
import SpriteObject from "../SpriteObject";
import bubbleManager, { BubbleManagerEvent } from "../bubbleManager";
import CollisionManager from "../collisionManager";
import BoardManager, { BoardManagerEvent } from "../boardManager";
import { rootBubble } from "../rootBubble";
import { Bubble, BubbleEvent } from "../bubble";
import { BALL_WIDTH, BALL_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PADDING_BOT } from "../constant";
import { getBubbleCoordinate } from "../utils";
const levelEvent = Object.freeze({
    Start: "level:start",
    Complete: "level:complete"
});

const resources = Loader.shared.resources;;
export default class Level extends Container {
    constructor(data) {
        super();
        this.list_bubble = data.list_bubble;
        this.map = data.map;
        this._initMap();
        this._initBubbleManager();
        this._initCollisionManager();
        this._initBoardManager();
        this._initEvent();

    }
    _initMap() {
        this.listBubble = [];
        this.game_background = new SpriteObject(resources["image/game_background.jpg"].texture);
        this.game_background.setScale(1.5, 1.5);
        this.addChild(this.game_background);
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                var color = this.checkColorBubble(this.map[i][j]);
                var bubble = new Bubble(color, i, j, this.map[i][j]);
                var tempCoor = getBubbleCoordinate(bubble, i, j);
                bubble.setPosition(tempCoor.x, tempCoor.y);
                this.listBubble.push(bubble);
            }
        }
    }

    _initBubbleManager() {
        this.bubble_shooter = [];
        for (let i = 0; i < this.list_bubble.length; i++) {
            var bubbleRoot = new rootBubble(0, 0, this.checkColorBubble(this.list_bubble[i]), this.list_bubble[i]);
            bubbleRoot.setPosition(GAME_WIDTH / 2, GAME_HEIGHT - PADDING_BOT)
            this.bubble_shooter.push(bubbleRoot);
        }
        this.bubbleManager = new bubbleManager(this.bubble_shooter);
        this.addChild(this.bubbleManager);
    }

    _initEvent() {
        this.interactive = true;
        this.on("pointerdown", (e) => {
            var pos = e.data.global;
            this.bubbleManager.shoot(pos.x, pos.y);
        });
        this.collisionManager.on(BoardManagerEvent.AddChild, this.boardManager.addBubble, this.boardManager);
        this.collisionManager.on(BubbleManagerEvent.ShootDone, this.bubbleManager.shootDone, this.bubbleManager);
        this.collisionManager.on(BoardManagerEvent.RemoveChild, this.boardManager.removeBubble, this.boardManager);
    }

    _initCollisionManager() {
        this.collisionManager = new CollisionManager(this.bubble_shooter, this.listBubble);
    }

    _initBoardManager() {
        this.boardManager = new BoardManager(this.listBubble);
        this.addChild(this.boardManager)
    }

    checkColorBubble(value) {
        var textures;
        switch (value) {
            case "blue":
                textures = Loader.shared.resources["image/bubble_blue.png"].texture;
                break;
            case "green":
                textures = Loader.shared.resources["image/bubble_green.png"].texture;
                break;
            case "lightblue":
                textures = Loader.shared.resources["image/bubble_lightBlue.png"].texture;
                break;
            case "pink":
                textures = Loader.shared.resources["image/bubble_pink.png"].texture;
                break;
            case "red":
                textures = Loader.shared.resources["image/bubble_red.png"].texture;
                break;
            case "transparent":
                textures = Loader.shared.resources["image/bubble_transparent.png"].texture;
                break;
            case "yellow":
                textures = resources["image/bubble_yellow.png"].texture;
                break;
            default:
                break;
        }
        return textures;
    }

    update(delta) {
        this.bubbleManager.update(delta);
        this.collisionManager.update();
    }
    complete() {
        this.emit(levelEvent.Complete, this);
    }

}