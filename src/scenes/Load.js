class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        //gameplay assets
        this.load.path = "assets/";
        //player
        this.load.atlas("player", "bunny.png", "bunny.json");
        //bubble
        this.load.atlas("bubble", "bubble.png", "bubble.json");

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