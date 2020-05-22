class Dialogue extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, textNum, currentLevel) {
        if(type == "jellyfish") {
            super(scene, x, y, "jelly", "jellyfish_1").setOrigin(0, 1);
        } else { //type == scroll
            super(scene, x, y, "scroll").setOrigin(0, 1);
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.boxOffsetX = 55+this.width/2;
        this.boxOffsetY = 55+this.height;

        this.textOffsetX = this.boxOffsetX-5;
        this.textOffsetY = this.boxOffsetY-5;
        this.textSpacing = 5;
    
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

        this.textContents = "";

        if (type == "jellyfish"){
            if(this.currentLevel == "tutorial") {
                if(textNum == 1){
                    this.textContents = "Use the ARROW KEYS to move and UP to jump. Move left to proceed";
                } else if (textNum == 2) {
                    this.textContents = "Spikes don't hurt Bun, because Bun is strong.";
                } else if (textNum == 3) {
                    this.textContents = "Jump down and meet Bun's greatest ally.";
                } else if (textNum == 4) {
                    this.textContents = "Press X to grab Bub, you must carry Bub to the end. Bub is a little heavy, so you can't jump as high.";
                } else if (textNum == 5) {
                    this.textContents = "You may be immune to spikes, but Bub is not.";
                } else if (textNum == 6) {
                    this.textContents = "This cliff seems dangerous, use your EAGLE VISION to see. Press Z to view the map. Use the ARROW KEYS to see.";
                } else if (textNum == 7) {
                    this.textContents = "Without Bub, you cannot enter the portal. Press R to restart the level.";
                }
            }
        } else { //type == scroll

        }

        this.text = this.scene.add.text(x-this.textOffsetX, y-this.textOffsetY, this.textContents, textConfig).setOrigin(0);

        //physics
        this.setImmovable(true);
        this.body.setAllowGravity(false);

        this.dialogueBox.alpha = 0;
        this.text.alpha = 0;

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
    }

    update() {
        if(this.body.touching.none) {
            this.dialogueBox.alpha = 0;
            this.text.alpha = 0;
        }
    }
}