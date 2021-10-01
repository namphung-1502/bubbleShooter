import { utils } from "pixi.js";
import Level from "./level";
export const LevelLoaderEvent = Object.freeze({
    Load: "levelloader:load",
});

export class LevelLoader extends utils.EventEmitter {
    constructor() {
        super();
    }
    load() {
        this._loadJSON("./level/levels.json", this._loadLevels.bind(this))
    }

    _loadJSON(path, onLoad) {
        let request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.send();
        request.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                let result = JSON.parse(this.response);
                onLoad(result);
            }
        });
    }

    _loadLevels(levels) {
        levels.forEach(this._loadLevel.bind(this));
    }

    _loadLevel(data) {
        let level = new Level(data);
        this.emit(LevelLoaderEvent.Load, level);
    }
}