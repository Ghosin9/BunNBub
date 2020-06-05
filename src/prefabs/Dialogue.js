class Dialogue extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, textContents) {
        //jelly fish npc
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

            //play the jellyfish animation
            this.anims.play("jIdle", true);

            //create the dialogue box
            this.boxOffsetX = 55+this.width/2;
            this.boxOffsetY = 55+this.height;
        } else { //type == scroll
            super(scene, x, y, "scroll").setOrigin(0, 1);

            //create the dialogue box
            this.boxOffsetX = 44;
            this.boxOffsetY = 55+this.height;

            //change Scroll animation
            this.scene.anims.create({
            key: "scrollSwitch",
            defaultTextureKey: "scroll2",
            frames: [
                {frame: ""},
                ]
            });
        }

        //create text inside the dialogue box
        this.textOffsetX = this.boxOffsetX-5;
        this.textOffsetY = this.boxOffsetY-5;
        this.textSpacing = 5;

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        //properties
        this.scene = scene;
        this.talking = false;
        this.type = type;

        //dialogue box
        this.dialogueBox = this.scene.add.image(x-this.boxOffsetX, y-this.boxOffsetY, "dialogue").setOrigin(0);

        //text configuration
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

        //align the text to the center if its a scroll
        if(type != "jelly") {
            textConfig.align = "center";
        }

        //create the textContents object 
        this.textContents = textContents;

        //add text to scene
        this.text = this.scene.add.text(x-this.textOffsetX, y-this.textOffsetY, this.textContents, textConfig).setOrigin(0);

        //physics
        this.setImmovable(true);
        this.body.setAllowGravity(false);

        //change text box and text to transparent
        this.dialogueBox.alpha = 0;
        this.text.alpha = 0;
    }

    update() {
        //if not touching anything, make the text transparent
        if(this.body.touching.none) {
            this.dialogueBox.alpha = 0;
            this.text.alpha = 0;
            
            //if jellyfish, remove the talking sound to allow for replay
            if(this.type == "jelly" && this.talking) {
                this.talking = false;
                this.scene.sound.removeByKey("jellytalk");
            }
        }
    }
}