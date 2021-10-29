import { Text, TextStyle, Loader } from "pixi.js";
import Scene from "../model/scene";
import SpriteObject from "../model/spriteObject";

export default class EndGame extends Scene {
    constructor(message, callback, fontSize = 36) {
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

        this.message = message;
        this.style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: fontSize,
            fontWeight: 'bold',
            fill: ['#bf5f00'],
            dropShadow: true,
            dropShadowColor: '#b2b2b2',
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