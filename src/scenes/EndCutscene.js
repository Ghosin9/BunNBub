class EndCutscene extends Phaser.Scene {
    constructor() {
        super("endcutscene");
    }

    create() {

        //add all cutscenes
        this.end1 = this.add.image(0, 0, "end1").setOrigin(0);
        this.end2 = this.add.image(0, 0, "end2").setOrigin(0).setAlpha(0);
        this.end3 = this.add.image(0, 0, "end3").setOrigin(0).setAlpha(0);
        this.end4 = this.add.image(0, 0, "end4").setOrigin(0).setAlpha(0);
        this.end5 = this.add.image(0, 0, "end5").setOrigin(0).setAlpha(0);
        this.end6 = this.add.image(0, 0, "end6").setOrigin(0).setAlpha(0);
        this.end7 = this.add.image(0, 0, "end7").setOrigin(0).setAlpha(0);

        //shake the camera slightly
        this.cameras.main.shake(1000000000, 0.0009);

        //text configuration for dialogue
        let textConfig = {
            fontFamily: "Helvetica",
            fontSize: "20px",
            fontStyle: "bold",
            align: "center",
            color: "#ffffff",
            fixedWidth: 630,
            fixedHeight: 50,
            wordWrap: {
                width: 630,
            },
        }

        //first line
        this.textContents = "I was supposed to find you at the end.";
        this.text = this.add.text(5, 25, this.textContents, textConfig).setOrigin(0);

        //create cursors to move dialogue
        this.cursors = this.input.keyboard.createCursorKeys();
        //what line of dialogue are we on
        this.counter = 1;
    }

    update() {
        //move dialogue along
        if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            switch(this.counter){
                case 1:
                    //2nd line
                    this.text.text = "What are you doing here?";
                    this.end2.setAlpha(1);
                    break;
                case 2:
                    //3rd line
                    this.text.text = "How dare you ask me why I’m here...";
                    this.end3.setAlpha(1);
                    break;
                case 3:
                    //4th line
                    this.text.text = "I have to protect my kingdom no matter the cost.";
                    this.end4.setAlpha(1);
                    break;
                case 4:
                    //5th line
                    this.text.text = "You call this protecting? Look how many lives have you taken.";
                    this.end5.setAlpha(1);
                    break;
                case 5:
                    //6th line
                    this.text.text = "Every portal you triggered with that bubble of yours… All those toxic spikes your jellyfish planted…";
                    this.text.y = 15;
                    this.end6.setAlpha(1);
                    break;
                case 6:
                    //7th line
                    this.text.text = "They all killed my friends.";
                    this.text.y = 25;
                    this.end7.setAlpha(1);
                    break;
                case 7:
                    //go back to the end level
                    this.scene.resume(game.settings.currentLevel);
                    this.scene.stop("endcutscene");
                    break;
            }

            //increase counter
            ++this.counter;
        }
    }
}
