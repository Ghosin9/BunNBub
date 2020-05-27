class Dialogue extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, textContents, currentLevel) {
        if(type == "jelly") {
            super(scene, x, y, "jelly", "jellyfish_1").setOrigin(0, 1);

            //idle
            this.scene.anims.create({
                key: "jIdle",
                frames: this.scene.anims.generateFrameNames("jelly", {
                    prefix: "jellyfish_",
                    start: 1,
                    end: 4,
                }),
                repeat: -1,
                frameRate: 3,
            });

            this.anims.play("jIdle", true);

            this.boxOffsetX = 55+this.width/2;
            this.boxOffsetY = 55+this.height;

            this.textOffsetX = this.boxOffsetX-5;
            this.textOffsetY = this.boxOffsetY-5;
            this.textSpacing = 5;
        } else { //type == scroll
            super(scene, x, y, "scroll").setOrigin(0, 1);

            this.boxOffsetX = 44;
            this.boxOffsetY = 55+this.height;

            this.textOffsetX = this.boxOffsetX-5;
            this.textOffsetY = this.boxOffsetY-5;
            this.textSpacing = 5;
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.scene = scene;
        this.currentLevel = currentLevel;

        //dialogue box
        this.dialogueBox = this.scene.add.image(x-this.boxOffsetX, y-this.boxOffsetY, "dialogue").setOrigin(0);

        let textConfig = {
            fontFamily: "Helvetica",
            fontSize: "10px",
            fontStyle: "bold",
            align: "left",
            color: "#000000",
            fixedWidth: 190,
            fixedHeight: 40,
            wordWrap: {
                width: 190,
            },
        }

        if(type != "jelly") {
            textConfig.align = "center";
        }

        this.textContents = textContents;

        this.text = this.scene.add.text(x-this.textOffsetX, y-this.textOffsetY, this.textContents, textConfig).setOrigin(0);

        //physics
        this.setImmovable(true);
        this.body.setAllowGravity(false);

        this.dialogueBox.alpha = 0;
        this.text.alpha = 0;
    }

    update() {
        if(this.body.touching.none) {
            this.dialogueBox.alpha = 0;
            this.text.alpha = 0;
        }
    }
}