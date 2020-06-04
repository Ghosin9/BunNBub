class Cutscene extends Phaser.Scene {
    constructor() {
        super("cutscene");
    }

    create() {
        this.cutscene1 = this.add.image(0, 0, "cutscene1").setOrigin(0);
        this.cutscene2 = this.add.image(0, 0, "cutscene2").setOrigin(0).setAlpha(0);
        this.cutscene3 = this.add.image(0, 0, "cutscene3").setOrigin(0).setAlpha(0);
        this.cutscene4 = this.add.image(0, 0, "cutscene4").setOrigin(0).setAlpha(0);
        //this.arrow = this.add.image(0, 0, "arrow").setOrigin(0).setScrollFactor(0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.num = 0;

        this.time.addEvent({
            delay: 3500,
            callback: this.changeCutscene,
            callbackScope: this,
            repeat: 4
        });

        this.window = this.cameras.main.getWorldPoint(375, 265);
        this.cameras.main.zoomTo(5, 6000, "Linear");
        this.cameras.main.pan(this.window.x, this.window.y, 3000);

        this.cameras.main.once("camerazoomcomplete", () => {
            this.cameras.main.fadeOut(1000);
        });

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.cameras.main.fadeIn(1000);
        });
        this.sound.play("beginbg");
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
           this.changeCutscene();
        }
    }

    changeCutscene() {
        if(this.num == 1) {
            this.cutscene2.setAlpha(1);
            this.cameras.main.setScroll(0, 0);
            this.cameras.main.setPosition(0, 0);
            this.cameras.main.zoom = 1; 
            this.cameras.main.zoomTo(2, 3000, "Linear");
        } else if (this.num == 2) {
            this.cutscene3.setAlpha(1);
            this.cameras.main.zoom = 1;
        } else if (this.num == 3) {
            this.cutscene4.setAlpha(1);
            this.cameras.main.shake(200, 0.05);
            this.cameras.main.zoom = 1;
        } else if (this.num == 4) {
            this.cameras.main.fadeOut(1500);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("menu");
            });
        } else if (this.num >= 5) {
            this.scene.start("menu");
        }

        ++this.num;
    }
}