import * as TWEEN from '@tweenjs/tween.js'
import { Text, TextStyle, Loader, Container } from "pixi.js";
import Scene from "../model/scene";
import SpriteObject from "../model/spriteObject";

export default class EndGame extends Scene {
    constructor(message, callback, fontSize = 36) {
        super();
        this.positionText = { x: 230, y: 250 };
        this.positionTable = { x: 70, y: 150 };
        this.positionButton = { x: 160, y: 320 };

        this.groupSprite = new Container();
        this.groupSprite.x = 0;
        this.groupSprite.y = -400;
        this.addChild(this.groupSprite);

        this.backgroundStart = new SpriteObject(Loader.shared.resources["image/table.png"].texture);
        this.backgroundStart.setScale(0.2, 0.2);
        this.backgroundStart.setPosition(this.positionTable.x, this.positionTable.y);
        this.groupSprite.addChild(this.backgroundStart);

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
        this.text.x = this.positionText.x;
        this.text.y = this.positionText.y;
        this.groupSprite.addChild(this.text);
        this.text.anchor.set(0.5);

        this.buttonRestart = new SpriteObject(Loader.shared.resources["image/restartButton.png"].texture);
        this.buttonRestart.setScale(0.15, 0.15);
        this.buttonRestart.x = this.positionButton.x;
        this.buttonRestart.y = this.positionButton.y;
        this.groupSprite.addChild(this.buttonRestart);

        this.buttonRestart.interactive = true;
        this.buttonRestart.buttonMode = true;
        this.buttonRestart.on("pointerdown", callback);

        var position = { x: this.groupSprite.x, y: this.groupSprite.y };
        var newPosition = { x: this.groupSprite.x, y: this.groupSprite.y + 400 };
        var tween = new TWEEN.Tween(position)
            .to(newPosition, 500)
            .onUpdate((pos) => {
                this.groupSprite.x = pos.x;
                this.groupSprite.y = pos.y;
            });
        tween.start();
    }

    setMessage(message) {
        this.message = message;
        this.text.text = message;
    }

    update() {
        TWEEN.update();
    }
}