class Pause extends Phaser.Scene {
    constructor() {
        super("pause");
    }

    create() {
        this.pauseImage = this.add.image(0, 0, "pauseImage").setOrigin(0);

        this.unPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.unPause)) {
            this.scene.resume("tutorial");
            this.scene.stop("pause");
        }
    }
}