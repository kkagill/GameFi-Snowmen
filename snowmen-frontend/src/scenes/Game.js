import Track from './Track.js';
import Player from './Player.js';
import Phaser from "phaser";
import store from '../../store';
import { gameOver, loadReward } from "../redux/actions"
import { HELMET_ID, SWORD_ID } from '../blockchain/itemIds.ts';

export default class MainGame extends Phaser.Scene {
    constructor() {
        super('MainGame');

        this.player;
        this.tracks;

        this.score = 0;
        //this.highscore = 0;

        this.scoreTimer;
        this.scoreText;
        this.startText;
        //this.highscoreText;

        this.atlasKey;
        this.receiveRewardText;

        store.subscribe(() => {
            let state = store.getState();
            if (!state.isAuthenticated) {
                console.log('game')
                this.scene.start("MainMenu");
            }           
        });
    }

    preload() {
        let state = store.getState();
        const userItemIds = state.userItems;

        if (userItemIds.length > 0) {
            this.load.setPath('assets/');
            if (userItemIds.length === 2) {
                this.load.atlas('sprites_helmet_sword', 'sprites_helmet_sword.png', 'sprites.json');
                this.atlasKey = 'sprites_helmet_sword';
            } else {
                if (userItemIds[0] === HELMET_ID) {
                    this.load.atlas('sprites_helmet', 'sprites_helmet.png', 'sprites.json');
                    this.atlasKey = 'sprites_helmet';
                } else if (userItemIds[0] === SWORD_ID) {
                    this.load.atlas('sprites_sword', 'sprites_sword.png', 'sprites.json');
                    this.atlasKey = 'sprites_sword';
                }
            }
            this.removeAnimation();
        }
    }

    removeAnimation() {
        this.anims.remove('die')
        this.anims.remove('idle')
        this.anims.remove('throwStart')
        this.anims.remove('throwEnd')
    }

    createAnimation(atlasKey) {
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNames(atlasKey, { prefix: 'die', start: 0, end: 0, zeroPad: 3 })
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames(atlasKey, { prefix: 'idle', start: 0, end: 3, zeroPad: 3 }),
            yoyo: true,
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'throwStart',
            frames: this.anims.generateFrameNames(atlasKey, { prefix: 'throw', start: 0, end: 8, zeroPad: 3 }),
            frameRate: 26
        });

        this.anims.create({
            key: 'throwEnd',
            frames: this.anims.generateFrameNames(atlasKey, { prefix: 'throw', start: 9, end: 11, zeroPad: 3 }),
            frameRate: 26
        });
    }

    create() {
        this.createAnimation(this.atlasKey);
        this.score = 0;
        //this.highscore = this.registry.get('highscore');

        this.add.image(512, 384, 'background');

        this.tracks = [
            new Track(this, 0, 196),
            new Track(this, 1, 376),
            new Track(this, 2, 536),
            new Track(this, 3, 700)
        ];

        this.player = new Player(this, this.tracks[0]);

        this.add.image(0, 0, 'overlay').setOrigin(0);

        this.add.image(16, 0, 'sprites', 'panel-score').setOrigin(0);
        //this.add.image(1024 - 16, 0, 'sprites', 'panel-best').setOrigin(1, 0);

        this.startText = this.add.text(400, 360, 'Space 눌러서 시작', { fontFamily: 'Arial', fontSize: 32, color: 'black' });
        this.scoreText = this.add.text(140, 2, this.score, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        // this.highscoreText = this.add.text(820, 2, this.highscore, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

        this.input.keyboard.once('keydown-SPACE', this.start, this);
    }

    start() {
        this.input.keyboard.removeAllListeners();
        this.startText.setVisible(false);

        this.tweens.add({
            targets: this.infoPanel,
            y: 700,
            alpha: 0,
            duration: 500,
            ease: 'Power2'
        });

        this.player.start();

        this.tracks[0].start(4000, 8000);
        this.tracks[1].start(500, 1000);
        this.tracks[2].start(5000, 9000);
        this.tracks[3].start(6000, 10000);

        this.scoreTimer = this.time.addEvent({
            delay: 1000, callback: () => {
                this.score++;
                this.scoreText.setText(this.score);
            }, callbackScope: this, repeat: -1
        });

        let state = store.getState();
        if (state.networkChanged) {
            this.scene.stop();
        }
    }

    gameOver() {
        //this.infoPanel.setTexture('gameover');

        this.tweens.add({
            targets: this.infoPanel,
            y: 384,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        this.tracks.forEach((track) => {
            track.stop();
        });

        this.player.stop();

        this.scoreTimer.destroy();

        // if (this.score > this.highscore) {
        //     this.highscoreText.setText('NEW!');
        //     this.registry.set('highscore', this.score);
        // }

        this.scene.pause();

        this.receiveRewardText = this.add.text(512, 360, '리워드 토큰을 받는 중입니다. 기다려 주세요..', { fontFamily: 'Arial', fontSize: 40, color: '#e3f2ed' });
        this.receiveRewardText.setOrigin(0.5);
        this.receiveRewardText.setStroke('#203c5b', 6);
        this.receiveRewardText.setShadow(2, 2, '#2d2d2d', 4, true, false);

        store.dispatch(loadReward(true));
        store.dispatch(gameOver(this.score));
    }
}
