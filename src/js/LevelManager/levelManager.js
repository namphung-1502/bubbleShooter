import { Container } from "pixi.js";
import Level, { levelEvent } from "./level";

export const LevelManagerEvent = Object.freeze({
    Start: "levelmanager:start",
    Complete: "levelmanager:complete",
    Finish: "levelmanager:finish",
    GameOver: "levelmanager:gameover"
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
        if (this.currentLevelIndex >= this.levels.length) {
            return;
        }
        let level = this.levels[this.currentLevelIndex];
        this.currentLevel = level;
        level.on(levelEvent.Complete, this.onLevelComplete, this);
        this.addChild(level);

        this.emit(LevelManagerEvent.start, level);

    }

    nextLevel() {
        // can not have current level index
        console.log(this.currentLevelIndex);
        let curLevel = this.levels[this.curLevelIndex];
        console.log(curLevel);
        this.removeChild(curLevel);
        this.startLevel(this.curLevelIndex + 1);
        console.log("oke");
    }


    onLevelComplete(level) {

        this.emit(LevelManagerEvent.Complete, level);

    }

    update(delta) {
        if (this.currentLevel != undefined) {
            this.currentLevel.update(delta);
        }
    }
}