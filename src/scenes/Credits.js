class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
    }

    create() { 
        this.add.image(0, 0, "creditsImage").setOrigin(0);

        this.credits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.credits)) {
            this.sound.play("menuSelect", {volume: 0.5});
            this.scene.start("menu");
        }
    }
}