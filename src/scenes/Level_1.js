class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    preload() {
        this.load.path = "./assets/";
        //png of tilesheet
        //1st parameter is key indicator
        //2nd parameter is path to png
        this.load.spritesheet("tilesheet", "tilesheet_complete.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        //json tilemap created from Tiled
        //1st parameter is key indicator
        //2nd parameter is path to json
        this.load.tilemapTiledJSON("tilemap1", "first.json");
    }

    create() {
        //create tilemap
        //load the json file as a tilemap
        //parameter is key indicator from the json
        const map = this.add.tilemap("tilemap1");
        //create tileset from tilemapping 
        //1st parameter is Tiled name for tilesheet
        //2nd parameter is tilesheet key indicator from the png above
        const tileset = map.addTilesetImage("first_tileset", "tilesheet");

        //create static layers
        //creating static layers must be inverse order of what tiled has to display layers correctly
        //parameter must be Tiled name for layer
        const backgroundLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const groundLayer = map.createStaticLayer("Ground", tileset, 0, 0);

        //create collisions for ground layer
        //property must be the same name as custom property in Tiled
        groundLayer.setCollisionByProperty({collides: true});

        //create player
        this.player = new Player(this);

        //set up collision 
        this.physics.add.collider(this.player, groundLayer);
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(10, 5);
    }

    update() {
        this.player.update();
    }
}