class EndCutscene extends Phaser.Scene {
    constructor() {
        super("endcutscene");
    }

    create() {
        this.end1 = this.add.image(0, 0, "end1").setOrigin(0);
        this.end2 = this.add.image(0, 0, "end2").setOrigin(0).setAlpha(0);
        this.end3 = this.add.image(0, 0, "end3").setOrigin(0).setAlpha(0);
        this.end4 = this.add.image(0, 0, "end4").setOrigin(0).setAlpha(0);
        this.end5 = this.add.image(0, 0, "end5").setOrigin(0).setAlpha(0);
        this.end6 = this.add.image(0, 0, "end6").setOrigin(0).setAlpha(0);
        this.end7 = this.add.image(0, 0, "end7").setOrigin(0).setAlpha(0);

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

        this.textContents = "I was supposed to find you at the end.";
        this.text = this.add.text(5, 25, this.textContents, textConfig).setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.counter = 1;
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            switch(this.counter){
                case 1:
                    this.text.text = "What are you doing here?";
                    this.end2.setAlpha(1);
                    break;
                case 2:
                    this.text.text = "How dare you ask me why I’m here...";
                    this.end3.setAlpha(1);
                    break;
                case 3:
                    this.text.text = "I have to protect my kingdom no matter the cost.";
                    this.end4.setAlpha(1);
                    break;
                case 4:
                    this.text.text = "You call this protecting? Look how many lives have you taken.";
                    this.end5.setAlpha(1);
                    break;
                case 5:
                    this.text.text = "Every portal you triggered with that bubble of yours… All those toxic spikes your jellyfish planted…";
                    this.text.y = 15;
                    this.end6.setAlpha(1);
                    break;
                case 6:
                    this.text.text = "They all killed my friends.";
                    this.text.y = 25;
                    this.end7.setAlpha(1);
                    break;
                case 7:
                    this.scene.resume(game.settings.currentLevel);
                    this.scene.stop("endcutscene");
                    break;
            }

            ++this.counter;
        }
    }
}
