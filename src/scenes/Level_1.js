//import AnimatedTiles from "../../lib/phaser-animated-tiles-master/dist/AnimatedTiles.min.js"

class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    preload() {
        //cancer plugin
        this.load.scenePlugin('AnimatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');

        this.load.path = "./assets/";
        //png of tilesheet
        //1st parameter is key indicator
        //2nd parameter is path to png
        this.load.spritesheet("tilesheet1", "tilesheet.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        //json tilemap created from Tiled
        //1st parameter is key indicator
        //2nd parameter is path to json
        this.load.tilemapTiledJSON("tilemap1", "tutorial.json");
    }

    create() {
        //create tilemap
        //load the json file as a tilemap
        //parameter is key indicator from the json
        const map = this.add.tilemap("tilemap1");
        //create tileset from tilemapping 
        //1st parameter is Tiled name for tilesheet
        //2nd parameter is tilesheet key indicator from the png above
        const tileset = map.addTilesetImage("tutorial", "tilesheet1");

        //create static layers
        //creating static layers must be inverse order of what tiled has to display layers correctly
        //parameter must be Tiled name for layer
        const backgroundLayer = map.createDynamicLayer("Background", tileset, 0, 0);
        const sceneryLayer = map.createDynamicLayer("Scenery", tileset, 0, 0);
        const spikeLayer = map.createDynamicLayer("Spikes", tileset, 0, 0);
        const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);

        this.sys.animatedTiles.init(map);

        //create collisions for ground layer
        //property must be the same name as custom property in Tiled
        groundLayer.setCollisionByProperty({collides: true});
        spikeLayer.setCollisionByProperty({collides: true});

        //create spawn point for player
        const pSpawn = map.findObject("Objects", obj => obj.name == "playerSpawn");
        //create player
        this.player = new Player(this, pSpawn.x, pSpawn.y);
        this.playerGroup = this.add.group({
            runChildUpdate: true,
        });
        this.playerGroup.add(this.player);

        //bubble spawn
        const bSpawn = map.findObject("Objects", obj => obj.name == "bubbleSpawn");
        //create bubble
        this.bubble = new Bubble(this, bSpawn.x, bSpawn.y);
        this.bubbleGroup = this.add.group({
            runChildUpdate: true,
        });
        this.bubbleGroup.add(this.bubble);

        //set up collision
        //ground collision
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.bubble, groundLayer);

        //spike collision
        this.physics.add.collider(this.bubble, spikeLayer, this.bubble.spikeCollision, null, this);

        //bun x bub 
        this.physics.add.overlap(this.player, this.bubble, this.player.bubbleCollision, null, this.player);

        //world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        let textConfig = {
            fontSize: "20px",
            align: "center"
        };

        //temp instruction text
        this.instructionText = this.add.group();
        this.hold = this.add.text(0, 0, "HOLD G TO GRAB", textConfig).setOrigin(0).setScrollFactor(0);
        this.arrow = this.add.text(0, 15, "ARROW KEYS TO MOVE", textConfig).setOrigin(0).setScrollFactor(0);
        this.r = this.add.text(0, 30, "R TO RESTART", textConfig).setOrigin(0).setScrollFactor(0);
        this.e = this.add.text(0, 45, "E TO VIEW MAP", textConfig).setOrigin(0).setScrollFactor(0);
        this.control = this.add.text(0, 60, "CONTROL MAP WITH ARROW KEYS", textConfig).setOrigin(0).setScrollFactor(0);
        this.spikes = this.add.text(0, 75, "SPIKES ONLY HURT BUBBLE", textConfig).setOrigin(0).setScrollFactor(0);
        this.instructionText.add(this.hold);

        //console.log(this.instructionText);

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(10, 5);
        this.cameras.main.setSize(640, 360);
    }

    update() {

    }
}