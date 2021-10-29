import { Loader, TextStyle, Text } from "pixi.js";
import Scene from "../model/scene";
import SpriteObject from "../model/spriteObject";
import Letter from "../model/letter";
import { GAME_HEIGHT, GAME_WIDTH } from "../constant";

export default class NextLevelScene extends Scene {
    constructor(score, callback) {
        super();
        this.backgroundStart = new SpriteObject(Loader.shared.resources["image/table.png"].texture);
        this.backgroundStart.setScale(0.2, 0.2);
        this.backgroundStart.setPosition(70, 150)
        this.addChild(this.backgroundStart);

        this.style = new TextStyle({
            fontFamily: "Roboto",
            fontSize: 32,
            fill: 0xbf5f00
        })
        this.titleLevelCompleted = new Text("Level Complete", this.style);
        this.titleLevelCompleted.x = 120;
        this.titleLevelCompleted.y = 180;
        this.addChild(this.titleLevelCompleted);

        this.start1 = new SpriteObject(Loader.shared.resources["image/star.png"].texture);
        this.start1.setScale(0.2, 0.2);
        this.start1.setPosition(130, 220);
        this.addChild(this.start1);

        this.start2 = new SpriteObject(Loader.shared.resources["image/star.png"].texture);
        this.start2.setScale(0.2, 0.2);
        this.start2.setPosition(200, 220);
        this.addChild(this.start2);

        this.start3 = new SpriteObject(Loader.shared.resources["image/star.png"].texture);
        this.start3.setScale(0.2, 0.2);
        this.start3.setPosition(270, 220);
        this.addChild(this.start3);

        this.textScore = new Text(`Score: ${score}`, this.style);
        this.textScore.x = 140;
        this.textScore.y = 300;
        this.addChild(this.textScore);

        this.buttonNext = new SpriteObject(Loader.shared.resources["image/nextLevel.png"].texture);
        this.buttonNext.setScale(0.12, 0.12);
        this.buttonNext.setPosition(GAME_WIDTH - 310, GAME_HEIGHT - 250);
        this.addChild(this.buttonNext);
        this.buttonNext.interactive = true;
        this.buttonNext.buttonMode = true;
        this.buttonNext.on("pointerdown", callback);
    }
}