class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        this.add.image(0, 0, "mainMenu").setOrigin(0).setDisplaySize(game.config.width, game.config.height);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("tutorial");
            this.sound.play("music", {volume: 0.25, loop: true});
        });
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.cameras.main.fadeOut(1000);
        }
    }
}