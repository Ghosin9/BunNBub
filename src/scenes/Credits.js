class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
    }

    create() { 
        //add the credits image
        this.add.image(0, 0, "creditsImage").setOrigin(0);

        //credits button
        this.credits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update() {
        //start the menu scene
        if(Phaser.Input.Keyboard.JustDown(this.credits)) {
            this.sound.play("menuSelect", {volume: 0.5});
            this.scene.start("menu");
        }
    }
}