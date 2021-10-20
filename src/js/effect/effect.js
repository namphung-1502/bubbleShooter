import { Emitter } from "pixi-particles";
import { utils, Texture, Loader } from 'pixi.js'
const resources = Loader.shared.resources;
export default class Effect extends Emitter {
    constructor(x, y, parent, texture, jsonFile) {
        let config = require(`../../../assets/effect/${jsonFile}`);
        config.pos.x = x;
        config.pos.y = y;
        let txt = resources[`image/${texture}.png`].texture;
        super(parent, [txt], config);
    }

    update(delta) {
        super.update(delta * 0.6);
    }
}