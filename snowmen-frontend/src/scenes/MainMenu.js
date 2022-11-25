import Phaser from "phaser";
import store from '../../store';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');

        store.subscribe(() => {
            let state = store.getState();
            if (state.isAuthenticated && !state.rewardLoading) {
                console.log('mainmenu1')
                this.scene.start("MainGame");
            }
        });
    }

    create() {
        this.sound.play('music', { loop: true, delay: 0 });
        this.add.image(512, 384, 'background');
        let logo = this.add.image(1700, 384, 'title');

        this.tweens.add({
            targets: logo,
            x: 512,
            ease: 'back.out',
            delay: 0,
            duration: 600,
        });

        let state = store.getState();
        if (state.isAuthenticated) {
            console.log('mainmenu2')
            this.scene.start("MainGame");
        }
    }
}
