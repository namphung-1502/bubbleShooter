import { Text, TextStyle } from "pixi.js";

export default class Letter extends Text {
    constructor(text, fontsize) {
        super();
        this.text = text;
        this.anchor.set(0.5);
        this.style = new TextStyle({
            fontFamily: "Arial",
            fontSize: fontsize,
            fill: 0xffffff
        })
    }
    setText(text) {
        this.text = text;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}