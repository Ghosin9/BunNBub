class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        //gameplay assets
        this.load.path = "assets/";

        //placeholder
        this.load.atlas("player", "bunny.png", "bunny.json")

        //level assets

        //ui assets
        this.load.path = "assets/ui/";

        //sound assets
        this.load.path = "assets/sound/";
    }

    create() {
        this.scene.start("level1");
    }
}