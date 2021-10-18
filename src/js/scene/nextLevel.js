import { Loader } from "pixi.js";
import Scene from "../model/scene";
import SpriteObject from "../model/spriteObject";
import Letter from "../model/letter";
import { GAME_HEIGHT, GAME_WIDTH } from "../constant";

export default class NextLevelScene extends Scene {
    constructor(score, callback) {
        super();
        this.backgroundStart = new SpriteObject(Loader.shared.resources["image/start_background.jpg"].texture);
        this.backgroundStart.setScale(0.8, 0.8);
        this.addChild(this.backgroundStart);

        this.scoreTitle = new Letter("Score", 60);
        this.scoreTitle.x = 230;
        this.scoreTitle.y = 200;
        this.addChild(this.scoreTitle);

        this.score = new Letter(score, 30);
        this.score.x = 230;
        this.score.y = 270;
        this.addChild(this.score);

        this.buttonNext = new SpriteObject(Loader.shared.resources["image/nextLevel.png"].texture);
        this.buttonNext.setScale(0.1, 0.1);
        this.buttonNext.setPosition(GAME_WIDTH - 300, GAME_HEIGHT - 230);
        this.addChild(this.buttonNext);
        this.buttonNext.interactive = true;
        this.buttonNext.buttonMode = true;
        this.buttonNext.on("pointerdown", callback);
    }
}