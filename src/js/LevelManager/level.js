import { Container, Loader, ParticleContainer } from "pixi.js";
import SpriteObject from "../model/spriteObject";
import bubbleManager, { BubbleManagerEvent } from "../manager/bubbleManager";
import CollisionManager from "../manager/collisionManager";
import BoardManager, { BoardManagerEvent } from "../manager/boardManager";
import { rootBubble } from "../model/rootBubble";
import { Bubble } from "../model/bubble";
import { GAME_WIDTH, GAME_HEIGHT, PADDING_BOT } from "../constant";
import { getBubbleCoordinate, checkColorBubble } from "../utils";
import EffectManager from "../effect/effectManager";
import { Howl, Howler } from "howler";
import MenuManager, { MenuManagerEvent } from "../manager/menuManager";
import * as TWEEN from '@tweenjs/tween.js'
import Effect from "../effect/effect";


export const levelEvent = Object.freeze({
    Start: "level:start",
    Complete: "level:complete",
    Failure: "level:failure",
    WinGame: "level:wingame"
});

const resources = Loader.shared.resources;
export default class Level extends Container {
    constructor(data) {
        super();
        this.nameLevel = data.name;
        this.list_bubble = data.list_bubble;
        this.map = data.map;
        this.lockBubble = false;
        this.testTrail = false;

        this._initMap();
        this._initMenuManager();
        this._initBubbleManager();
        this._initCollisionManager();
        this._initBoardManager();

        this._initEvent();
        this._initEffectManager();


    }
    _initMap() {
        this.listBubble = [];
        this.game_background = new SpriteObject(resources["image/game_background.jpg"].texture);
        this.game_background.setScale(1.2, 1.2);
        this.addChild(this.game_background);

        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                var color = checkColorBubble(this.map[i][j]);
                var bubble = new Bubble(color, i, j, this.map[i][j]);
                var tempCoor = getBubbleCoordinate(bubble, i, j);
                bubble.setPosition(tempCoor.x, tempCoor.y);
                this.listBubble.push(bubble);
            }
        }
    }

    _initBubbleManager() {
        this.bubble_shooter = [];
        for (let i = 0; i < this.list_bubble.length; i++) {
            var bubbleRoot = new rootBubble(0, 0, checkColorBubble(this.list_bubble[i]), this.list_bubble[i]);
            bubbleRoot.setPosition(GAME_WIDTH / 2, GAME_HEIGHT - PADDING_BOT)
            this.bubble_shooter.push(bubbleRoot);
        }
        this.bubbleManager = new bubbleManager(this.bubble_shooter, this.listBubble);
        this.addChild(this.bubbleManager);
    }

    _initEvent() {
        this.interactive = true;
        this.on("pointerdown", (e) => {
            if (!this.lockBubble) {
                var pos = e.data.global;
                this.bubbleManager.shoot(pos.x, pos.y);
            }
        });
        this.collisionManager.on(BoardManagerEvent.AddChild, this.boardManager.addBubble, this.boardManager);
        this.boardManager.on(BubbleManagerEvent.ShootDone, this.bubbleManager.shootDone, this.bubbleManager)
        this.collisionManager.on(BoardManagerEvent.RemoveChild, this.boardManager.removeBubble, this.boardManager);
        this.collisionManager.on(BoardManagerEvent.SpecialBallShoot, this.boardManager.specialBallShoot, this.boardManager);
        this.bubbleManager.on(BubbleManagerEvent.RootBubbleOnTop, this.boardManager.addBubbleOnTop, this.boardManager);
        this.bubbleManager.on(BubbleManagerEvent.OutOfBubble, this.failure, this);
        this.bubbleManager.on(BubbleManagerEvent.UnlockBubble, this.unlockBubble, this);
        this.bubbleManager.on(BubbleManagerEvent.LockBubble, this.onLockBubble, this);
        this.boardManager.on(BoardManagerEvent.onClear, this.complete, this);
        this.boardManager.on(BoardManagerEvent.AddEffect, this.createEffect, this);
        this.boardManager.on(BoardManagerEvent.BombEffect, this.bombEffect, this);
        this.boardManager.on(BoardManagerEvent.DeadBubble, this.failure, this);
        this.boardManager.on(BubbleManagerEvent.LockBubble, this.onLockBubble, this);
        this.boardManager.on(BubbleManagerEvent.UnlockBubble, this.unlockBubble, this);
        this.boardManager.on(BubbleManagerEvent.BombItemActive, this.bubbleManager.itemBombActive, this.bubbleManager);
        this.boardManager.on(BubbleManagerEvent.SpecialBallActive, this.bubbleManager.itemSpecialBallActive, this.bubbleManager);
        this.boardManager.on(MenuManagerEvent.UpdateScore, this.menuManager.updateScore, this.menuManager);;
        this.boardManager.on(BubbleManagerEvent.RemoveRootBubble, this.bubbleManager.removeRootBubble, this.bubbleManager)
        this.menuManager.on(MenuManagerEvent.LevelComplete, this.complete, this);
        this.bubbleManager.on(BoardManagerEvent.AddBombItem, this.boardManager.addBombItem, this.boardManager);
        this.bubbleManager.on(BoardManagerEvent.AddSpecialBallItem, this.boardManager.addSpecialBallItem, this.boardManager);
        this.bubbleManager.on(BoardManagerEvent.ClearEffect, this.clearEffect, this);

    }

    _initCollisionManager() {
        this.collisionManager = new CollisionManager(this.bubble_shooter, this.listBubble);
    }

    _initBoardManager() {
        this.boardManager = new BoardManager(this.listBubble, this.nameLevel);
        this.addChild(this.boardManager)
    }

    _initMenuManager() {
        this.menuManager = new MenuManager(this.nameLevel, this.listBubble.length);
        this.addChild(this.menuManager);
    }

    _initSound() {
        this.sound = new Howl({
            src: ['./audio/audio_rave_digger.mp3', './audio/audio_rave_digger.webm'],
            autoplay: true,
            loop: true,
            volume: 0.5,
        });
        this.sound.play();
        Howler.volume(0.6);

    }

    _initEffectManager() {
        this.effectManager = new EffectManager();
        this.addChild(this.effectManager)
    }
    createEffect(value) {
        this.effectManager.explodeBubbleEffect(value.x, value.y);
    }
    bombEffect(value) {
        this.effectManager.bombEffect(value.x, value.y);
    }
    clearEffect() {
        this.effectManager.visible = false;
        this.effectManager.clearEffect();
    }

    unlockBubble() {
        this.lockBubble = false;
    }

    onLockBubble() {
        this.lockBubble = true;
    }
    update(delta) {
        // TWEEN.update();
        if (this.testTrail) {
            this.trailEffect.resetPositionTracking();
            this.trailEffect.updateOwnerPos(this.trailX, this.trailY);
        }
        this.bubbleManager.update(delta);
        this.boardManager.update(delta);
        this.collisionManager.update(delta);
        this.effectManager.update(delta);
        this.menuManager.update(delta);
    }

    failure() {
        if (!this.isCompleted) {
            this.boardManager.onFailLevel = true;
            this.alpha = 0.2;
            this.bubbleManager.visible = false;
            this.emit(levelEvent.Failure, this);
            this.boardManager.freeBall();
        }
    }

    complete(score) {
        this.isCompleted = true;
        this.alpha = 0.2;
        this.bubbleManager.visible = false;
        this.menuManager.visible = false;
        this.boardManager.visible = false;
        if (this.nameLevel != "Level 3") {
            this.alpha = 0.2;
            this.emit(levelEvent.Complete, this.menuManager.score);
        } else {
            this.emit(levelEvent.WinGame, this)
        }
    }

}