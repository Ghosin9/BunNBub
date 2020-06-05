class Cutscene extends Phaser.Scene {
    constructor() {
        super("cutscene");
    }

    create() {
        //add the cutscene images
        this.cutscene1 = this.add.image(0, 0, "cutscene1").setOrigin(0);
        this.cutscene2 = this.add.image(0, 0, "cutscene2").setOrigin(0).setAlpha(0);
        this.cutscene3 = this.add.image(0, 0, "cutscene3").setOrigin(0).setAlpha(0);
        this.cutscene4 = this.add.image(0, 0, "cutscene4").setOrigin(0).setAlpha(0);
        //this.arrow = this.add.image(0, 0, "arrow").setOrigin(0).setScrollFactor(0);

        //arrow keys to skip cutscene
        this.cursors = this.input.keyboard.createCursorKeys();
        //counter of what cutscene we are on
        this.num = 0;

        //timer to change the cutscene
        this.time.addEvent({
            delay: 3500,
            callback: this.changeCutscene,
            callbackScope: this,
            repeat: 4
        });

        //window of the boat
        this.window = this.cameras.main.getWorldPoint(375, 265);
        //zoom and pan to the window
        this.cameras.main.zoomTo(5, 6000, "Linear");
        this.cameras.main.pan(this.window.x, this.window.y, 3000);

        //once the zoom is done, fade to black
        this.cameras.main.once("camerazoomcomplete", () => {
            this.cameras.main.fadeOut(1000);
        });

        //once the fade is done, fade back in
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
            //add the 2nd cutscen
            this.cutscene2.setAlpha(1);
            //reset camera position
            this.cameras.main.setScroll(0, 0);
            this.cameras.main.setPosition(0, 0);
            //reset camera zoom
            this.cameras.main.zoom = 1;
            //zoom to the bunny
            this.cameras.main.zoomTo(2, 3000, "Linear");
        } else if (this.num == 2) {
            //add the 3rd cutscene
            this.cutscene3.setAlpha(1);
            //reset camera zoom
            this.cameras.main.zoom = 1;
        } else if (this.num == 3) {
            //add the 4th cutscene
            this.cutscene4.setAlpha(1);
            //shake the camera
            this.cameras.main.shake(200, 0.05);
        } else if (this.num == 4) {
            //fade out
            this.cameras.main.fadeOut(1500);
            //once the camera is done fading out
            this.cameras.main.once("camerafadeoutcomplete", () => {
                //start the menu
                this.scene.start("menu");
            });
        } else if (this.num >= 5) {
            //if you spammed the arrow key to skip the cutscene, start the menu
            this.scene.start("menu");
        }

        //increase count
        ++this.num;
    }
}