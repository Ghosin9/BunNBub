class Pause extends Phaser.Scene {
    constructor() {
        super("pause");
    }

    create() {
        this.pauseImage = this.add.image(0, 0, "pauseImage").setOrigin(0);

        this.pressed = false;

        this.unPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.menu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.unPause) && !this.pressed) {
            this.scene.resume(game.settings.currentLevel);
            this.scene.stop("pause");
        }

        if(Phaser.Input.Keyboard.JustDown(this.menu) && !this.pressed) {
            this.scene.stop(game.settings.currentLevel);
            this.sound.stopAll();
            this.scene.start("menu");
            this.scene.stop("pause");
        }
    }
}