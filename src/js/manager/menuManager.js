import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { GAME_HEIGHT, GAME_WIDTH, PADDING_TOP } from '../constant';
import Letter from '../model/letter';
import Scene from '../model/scene';

export const MenuManagerEvent = Object.freeze({
    UpdateScore: "menumanagerevent:updatescore"
})
export default class MenuManager extends Container {
    constructor(level, numberOfBall) {
        super();
        this.level = level;
        this.numberOfBall = numberOfBall;
        console.log(numberOfBall);
        this.percentWin = 0;
        this.score = 0;
        this.scoreBarWidth = 200;
        this.step = this.scoreBarWidth / this.numberOfBall;
        this._init();
    }
    _init() {

        this.scoreBar = new Scene();
        this.scoreBar.position.set(70, 25);
        this.addChild(this.scoreBar);

        let innerBar = new Graphics();
        innerBar.beginFill(0xFFFFFF);
        innerBar.drawRect(0, 0, this.scoreBarWidth, 20);
        innerBar.endFill();
        this.scoreBar.addChild(innerBar);

        let outerBar = new Graphics();
        outerBar.beginFill(0x00007f);
        outerBar.drawRect(0, 0, 1, 20);
        outerBar.endFill();
        this.scoreBar.addChild(outerBar);
        this.scoreBar.outer = outerBar;
        this.scoreBar.outer.width = 0;

        this.message = new Letter(this.level, 32);

        this.message.x = GAME_WIDTH / 2;
        this.message.y = GAME_HEIGHT / 2 + 120;

        this.addChild(this.message);

        this.percentToWin = new Letter(`${this.percentWin}%`, 20);
        this.percentToWin.x = 30;
        this.percentToWin.y = 35;
        this.addChild(this.percentToWin);

        this.titleScore = new Letter("Score", 25);
        this.titleScore.x = GAME_WIDTH - 120;
        this.titleScore.y = 20;
        this.addChild(this.titleScore);

        this.scoreText = new Letter(`${this.score}`, 20);
        this.scoreText.x = GAME_WIDTH - 120;
        this.scoreText.y = 50;
        this.addChild(this.scoreText);

    }

    updateScore(numOfBall) {
        if (this.scoreBar.outer.width > this.scoreBarWidth) {
            // this.emit()
            console.log("oke")
        } else {
            this.percentWin += Math.round(numOfBall * 100 / this.numberOfBall);
            this.scoreBar.outer.width += Math.round(this.step * numOfBall);
            this.score += 20 * numOfBall;
        }
    }
    setPosition(x, y) {
        this.position.set(x, y)
    }

    update(delta) {
        this.scoreText.setText(`${this.score}`);
        this.percentToWin.setText(`${this.percentWin}%`);
    }
}