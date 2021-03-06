import { Container } from "pixi.js";
import Level, { levelEvent } from "./level";

export const LevelManagerEvent = Object.freeze({
    Start: "levelmanager:start",
    Complete: "levelmanager:complete",
    Finish: "levelmanager:finish",
    GameOver: "levelmanager:gameover",
});

export class LevelManager extends Container {
    constructor() {
        super();

        /**@type {Array<Level>} */ // init array contain level
        this.levels = [];
        this.currentLevelIndex = 0;
    }

    addLevel(level) {
        this.levels.push(level);
    }

    start() {
        if (this.levels.length <= 0) {
            return;
        }
        this.startLevel(0);

    }

    startLevel(index) {
        this.currentLevelIndex = index;
        let level = this.levels[this.currentLevelIndex];
        this.currentLevel = level;
        level.on(levelEvent.Complete, this.onLevelComplete, this);
        level.on(levelEvent.Failure, this.onLevelFail, this);
        level.on(levelEvent.WinGame, this.onWinGame, this);
        this.addChild(level);

        this.emit(LevelManagerEvent.start, level);

    }

    nextLevel() {
        let curLevel = this.levels[this.curLevelIndex];
        this.removeChild(curLevel);
        this.startLevel(this.currentLevelIndex + 1);
    }

    onLevelFail(level) {
        this.emit(LevelManagerEvent.GameOver, level);
    }

    onLevelComplete(score) {
        this.emit(LevelManagerEvent.Complete, score);
    }
    onWinGame() {
        this.emit(LevelManagerEvent.Finish, this);
    }

    update(delta) {
        if (this.currentLevel != undefined) {
            this.currentLevel.update(delta);
        }
    }
}