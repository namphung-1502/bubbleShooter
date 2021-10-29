import * as PIXI from 'pixi.js'
import Scene from './model/scene.js';
import SpriteObject from './model/spriteObject.js';
import { LevelManager, LevelManagerEvent } from './LevelManager/levelManager'
import { LevelLoader, LevelLoaderEvent } from './LevelManager/levelLoader'
import { GAME_HEIGHT, GAME_WIDTH } from './constant.js';
import EndGame from './scene/endGame.js';
import NextLevelScene from './scene/nextLevel.js';
const Application = PIXI.Application,
    Loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources;;

class Game extends Application {
    constructor() {
        super();
        this.width = GAME_WIDTH;
        this.height = GAME_HEIGHT;
        this.level = 1;
        this.renderer.resize(this.width, this.height);
        this.renderer.backgroundColor = 0x333333;
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";
        this.renderer.view.style.transform = "translate(-50%,-50%)";
        // this.renderer.plugins.interaction.moveWhenInside = true;
        document.body.appendChild(this.view);
    }

    init() {
        Loader.add("image/bubble_blue.png")
            .add("image/bubble_green.png")
            .add("image/bubble_lightBlue.png")
            .add("image/bubble_pink.png")
            .add("image/bubble_red.png")
            .add("image/bubble_transparent.png")
            .add("image/bubble_yellow.png")
            .add("image/start_background.jpg")
            .add("image/playButton.png")
            .add("image/game_background.jpg")
            .add("image/nextLevel.png")
            .add("image/restartButton.png")
            .add("image/brick_orange.png")
            .add("image/brick_blue.png")
            .add("image/brick_purple.png")
            .add("image/brick_green.png")
            .add("image/bomb.png")
            .add("image/fire.png")
            .add("image/specialBall.png")
            .add("image/star.png")
            .add("image/table.png")
            .load(this.setup.bind(this))
    }
    setup() {
        this.startScene = new Scene();
        this.stage.addChild(this.startScene);
        this.startScene.setVisible(false);

        this.backgroundStart = new SpriteObject(resources["image/start_background.jpg"].texture);
        this.backgroundStart.setScale(0.8, 0.8);
        this.startScene.addChild(this.backgroundStart);

        this.buttonStart = new SpriteObject(resources["image/playButton.png"].texture)
        this.buttonStart.setScale(0.1, 0.1);
        this.buttonStart.setPosition(this.width - 300, this.height - 300);
        this.buttonStart.interactive = true;
        this.buttonStart.buttonMode = true;
        this.buttonStart.on("pointerdown", () => {
            this.startScene.setVisible(false);
            this.gameScene.setVisible(true);
        });
        this.startScene.addChild(this.buttonStart);

        this.gameScene = new Scene();
        this.stage.addChild(this.gameScene);

        this.gameScene.setVisible(true);

        this.levelLoader = new LevelLoader();
        this.levelManager = new LevelManager();
        this.gameScene.addChild(this.levelManager);

        this.levelLoader.on(LevelLoaderEvent.Load, this.levelManager.addLevel, this.levelManager);
        this.levelLoader.once(LevelLoaderEvent.Load, this.levelManager.start, this.levelManager);

        this.levelManager.on(LevelManagerEvent.Complete, this.nextLevel, this);
        this.levelManager.on(LevelManagerEvent.GameOver, this.end, this);
        this.levelManager.on(LevelManagerEvent.Finish, this.finish, this);


        this.levelLoader.load();

        this.state = this.play;
        this.ticker.add((delta) => this.loop(delta));

    }

    loop(delta) {
        this.state(delta);
    }

    play(delta) {
        this.levelManager.update(delta);
    }
    nextLevel(score) {
        this.nextLevel = new NextLevelScene(score, () => {
            this.nextLevel.setVisible(false);
            this.levelManager.nextLevel();
        })
        this.stage.addChild(this.nextLevel);

    }

    end() {
        this.startScene.setVisible(false);
        this.endgame = new EndGame("You lose", () => location.reload());
        this.stage.addChild(this.endgame);
    }
    finish() {
        this.startScene.setVisible(false);
        this.finish = new EndGame("You win", () => location.reload());
        this.stage.addChild(this.finish);
    }

}

export default Game;