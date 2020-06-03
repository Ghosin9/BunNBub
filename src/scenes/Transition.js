class Transition extends Phaser.Scene {
    constructor() {
        super("transition");
    }

    create() {
        this.nextLevel = "level5";
        this.counter = 1;

        let textConfig = {
            fontFamily: "Helvetica",
            fontSize: "15px",
            fontStyle: "bold",
            align: "center",
            color: "#ffffff",
            fixedWidth: 630,
            fixedHeight: 55,
            wordWrap: {
                width: 630,
            },
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.canPress = false;

        this.timer = this.time.addEvent({
            delay: 2000,
            callback: this.changeCutscene,
            callbackScope: this,
            repeat: -1,
            paused: true,
        });

        this.timer2 = this.time.addEvent({
            delay: 7000,
            callback: this.haiku,
            callbackScope: this,
            repeat: -1,
            paused: true
        });

        switch(game.settings.currentLevel) {
            case "tutorial":
                this.add.image(0, 0, "t1").setOrigin(0);
                this.nextLevel = "level1";
                break;
            case "level1":
                this.add.image(0, 0, "t2").setOrigin(0);
                
                this.textContents = "Stories of conquest\n A great leader we must face\n Never defeated"
                this.add.text(5, 10, this.textContents, textConfig);

                this.nextLevel = "level2";
                break;
            case "level2":
                this.add.image(0, 0, "t3").setOrigin(0);

                this.textContents = "He rides great turtles\n Splashes in geysers for fun\n His name sends shivers"
                this.add.text(5, 10, this.textContents, textConfig);

                this.nextLevel = "level3";
                break;
            case "level3":
                this.add.image(0, 0, "t4").setOrigin(0);

                this.textContents = "Slays all challengers\n None ever made it past him\n Nor his jellyfish"
                this.add.text(5, 10, this.textContents, textConfig);

                this.nextLevel = "level4";
                break;
        }
    }

    update() {
        if(game.settings.currentLevel != "level4") {
            this.timer2.paused = false;
        } else {
            this.timer.paused = false;
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.canPress) {
            this.scene.start(this.nextLevel);
        }
    }

    haiku() {
        this.add.image(0, 0, "arrow").setOrigin(0);
        this.canPress = true;
    }

    changeCutscene() {

        let textConfig = {
            fontFamily: "Helvetica",
            fontSize: "25px",
            fontStyle: "bold",
            align: "center",
            color: "#ffffff",
            fixedWidth: 630,
            wordWrap: {
                width: 630,
            },
        }

        switch(this.counter) {
            case 1:
                this.add.image(0, 0, "black").setOrigin(0);
                this.textContents = "You’ve come all this way\n And finally it is time\n The boss always wins"
                this.add.text(5, 140, this.textContents, textConfig);
                break;
            case 4:
                this.add.image(0, 0, "lastTransition", "eyes.png").setOrigin(0);
                break;
            case 5:
                this.add.image(0, 0, "lastTransition", "eyes2.png").setOrigin(0);
                break;
            case 6:
                this.add.image(0, 0, "lastTransition", "tween2.png").setOrigin(0);
                break;
            case 7:
                this.add.image(0, 0, "lastTransition", "tween2-wo.png").setOrigin(0);
                break;
            case 8:
                this.add.image(0, 0, "lastTransition", "tween3.png").setOrigin(0);
                break;
            case 9:
                this.add.image(0, 0, "lastTransition", "tween3-wo.png").setOrigin(0);
                break;
            case 10:
                this.add.image(0, 0, "lastTransition", "tween4.png").setOrigin(0);
                break;
            case 11:
                this.add.image(0, 0, "lastTransition", "tween4-wo.png").setOrigin(0);
                this.haiku();
                break;
        }

        ++this.counter;

        this.nextLevel = "level5";
    }
}