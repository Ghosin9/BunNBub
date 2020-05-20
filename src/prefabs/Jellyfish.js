class Jellyfish extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, text) {
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.boxOffsetX = 100;
        this.boxOffsetY = 70;

        this.textOffsetX = this.boxOffsetX-5;
        this.textOffsetY = this.boxOffsetY-5;
        this.textSpacing = 5;
    
        this.scene = scene;

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

        this.text = this.scene.add.text(x-this.textOffsetX, y-this.textOffsetY, text, textConfig).setOrigin(0);

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

    talk() {
        this.dialogueBox.alpha = 1;
        this.text.alpha = 1;
    }
}