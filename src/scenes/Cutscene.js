class Cutscene extends Phaser.Scene {
    constructor() {
        super("cutscene");
    }

    create() {

        this.cutscene1 = this.add.image(0, 0, "cutscene1").setOrigin(0);
        this.cutscene2 = this.add.image(0, 0, "cutscene2").setOrigin(0).setAlpha(0);
        this.cutscene3 = this.add.image(0, 0, "cutscene3").setOrigin(0).setAlpha(0);
        this.cutscene4 = this.add.image(0, 0, "cutscene4").setOrigin(0).setAlpha(0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.num = 0;

        this.time.addEvent({
            delay: 4000,
            callback: this.changeCutscene,
            callbackScope: this,
            repeat: 4
        });

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("menu");
        });
    }

    update() {
        if(this.num == 1) {
            this.cutscene2.setAlpha(1);
        } else if (this.num == 2) {
            this.cutscene3.setAlpha(1);
        } else if (this.num == 3) {
            this.cutscene4.setAlpha(1);
        } else if (this.num == 4) {
            this.cameras.main.fadeOut(2000);
        } else if (this.num >= 5) {
            this.scene.start("menu");
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
           this.changeCutscene();
        }
    }

    changeCutscene() {
        ++this.num;
    }
}