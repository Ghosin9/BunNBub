class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        this.menu = this.add.tileSprite(0, 0, game.config.width, game.config.height, "mainMenu").setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.credits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.pressed = false;

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("tutorial");
            this.sound.removeByKey("menubg");
        });

        this.time.addEvent({
            delay: 400,
            callback: this.animate,
            callbackScope: this,
            repeat: -1,
        });

        this.sound.play("menubg", {volume: 0.2, loop: true});
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.cursors.space) && !this.pressed) {
            this.cameras.main.fadeOut(1000);
            this.sound.play("menuSelect", {volume: 0.5});
            this.pressed = true;
        }

        if(Phaser.Input.Keyboard.JustDown(this.credits)) {
            this.sound.play("menuSelect", {volume: 0.5});
            this.scene.start("credits");
        }
    }

    animate() {
        this.menu.tilePositionX += 640;
    }
}