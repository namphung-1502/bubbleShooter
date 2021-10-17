import { Text, TextStyle, Loader } from "pixi.js";
import Scene from "../model/Scene";
import SpriteObject from "../model/SpriteObject";

export default class EndGame extends Scene {
    constructor(message, callback, fontSize = 36) {
        super();
        this.backgroundStart = new SpriteObject(Loader.shared.resources["image/start_background.jpg"].texture);
        this.backgroundStart.setScale(0.8, 0.8);
        this.addChild(this.backgroundStart);
        this.message = message;
        this.style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: fontSize,
            fontWeight: 'bold',
            fill: ['#ffffff'],
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 3,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 4,
        });

        this.text = new Text(this.message, this.style);
        this.text.x = 230;
        this.text.y = 250;
        this.addChild(this.text);
        this.text.anchor.set(0.5);

        this.buttonRestart = new SpriteObject(Loader.shared.resources["image/restartButton.png"].texture);
        this.buttonRestart.setScale(0.15, 0.15);
        this.buttonRestart.x = 160;
        this.buttonRestart.y = 300;
        this.addChild(this.buttonRestart);

        this.buttonRestart.interactive = true;
        this.buttonRestart.buttonMode = true;
        this.buttonRestart.on("pointerdown", callback);
    }

    setMessage(message) {
        this.message = message;
        this.text.text = message;
    }
}