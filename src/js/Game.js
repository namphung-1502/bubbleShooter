import * as PIXI from 'pixi.js'
import Scene from './Scene.js'
import SpriteObject from './SpriteObject.js';
import { LevelManagerEvent, LevelManager } from './LevelManager/levelManager.js';
import { LevelLoaderEvent, LevelLoader } from './LevelManager/levelLoader.js';
import { GAME_WIDTH, GAME_HEIGHT } from './constant.js'
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
            .load(this.setup.bind(this))
    }
    setup() {


        this.startScene = new Scene();
        this.stage.addChild(this.startScene);
        this.startScene.setVisible(false);

        this.backgroundStart = new SpriteObject(resources["image/start_background.jpg"].texture);
        this.startScene.addChild(this.backgroundStart);

        this.buttonStart = new SpriteObject(resources["image/playButton.png"].texture)
        this.buttonStart.setScale(0.1, 0.1);
        this.buttonStart.setPosition(this.width - 350, this.height - 300);
        this.buttonStart.interactive = true;
        this.buttonStart.buttonMode = true;
        this.buttonStart.on("pointerdown", () => {
            this.startScene.setVisible(false);
            this.gameScene.setVisible(true);
        });
        this.startScene.addChild(this.buttonStart);

        this.gameScene = new Scene();
        this.stage.addChild(this.gameScene);

        this.game_background = new SpriteObject(resources["image/game_background.jpg"].texture);
        this.gameScene.addChild(this.game_background);
        this.game_background.setScale(1.5, 1.5);
        this.gameScene.setVisible(true);

        this.gameOverScene = new Scene();
        this.gameOverScene.setVisible(false);
        this.levelLoader = new LevelLoader();
        this.levelManager = new LevelManager();
        this.gameScene.addChild(this.levelManager);

        this.levelLoader.on(LevelLoaderEvent.Load, this.levelManager.addLevel, this.levelManager);
        this.levelLoader.once(LevelLoaderEvent.Load, this.levelManager.start, this.levelManager);

        this.levelManager.on(LevelManagerEvent.Complete, this.levelManager.nextLevel, this.levelManager);
        this.levelManager.on(LevelManager.GameOver, this.end, this);

        this.levelLoader.load();
        this.state = this.play;
        this.ticker.add((delta) => this.loop(delta));

    }

    loop(delta) {
        this.state(delta);
    }

    play(delta) {

    }
    end() {

    }

}

export default Game;