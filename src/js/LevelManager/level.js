import { Container, Text, TextStyle, Loader } from "pixi.js";
import SpriteObject from "../SpriteObject";
import bubbleManager from "../bubbleManager";
import { rootBubble } from "../rootBubble";
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
        this.bubble_width = 39;
        this.bubble_height = 39;
        this._initMap();
        this._initBubbleManager();
        this._initEvent();
    }
    _initMap() {
        this.game_background = new SpriteObject(resources["image/game_background.jpg"].texture);
        this.game_background.setScale(1.5, 1.5);
        this.addChild(this.game_background);
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                var color = this.checkColorBubble(this.map[i][j]);
                var bubble = new SpriteObject(color);
                bubble = this.getBubbleCoordinate(bubble, i, j);
                this.addChild(bubble);
            }
        }
    }

    _initBubbleManager() {
        this.bubble_shooter = [];
        for (let i = 0; i < this.list_bubble.length; i++) {
            var bubble = new rootBubble(0, 0, this.checkColorBubble(this.list_bubble[i]));;
            this.bubble_shooter.push(bubble);
        }
        this.bubbleManager = new bubbleManager(this.bubble_shooter);
        this.addChild(this.bubbleManager);
    }

    _initEvent() {
        this.interactive = true;
        this.on("pointerdown", () => {
            this.bubbleManager.shoot();
        });
    }
    getBubbleCoordinate(bubble, r, c) {
        bubble.x = c * this.bubble_width;
        if (r % 2)
            bubble.x += this.bubble_width / 2;
        bubble.y = r * this.bubble_height;
        return bubble;
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
    }
    complete() {
        this.emit(levelEvent.Complete, this);
    }

}