class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        this.menu = this.add.tileSprite(0, 0, game.config.width, game.config.height, "mainMenu").setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("tutorial");
            this.sound.play("music", {volume: 0.2, loop: true});
        });

        this.time.addEvent({
            delay: 400,
            callback: this.animate,
            callbackScope: this,
            repeat: -1,
        });
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.cameras.main.fadeOut(1000);
        }
    }

    animate() {
        this.menu.tilePositionX += 640;
    }
}