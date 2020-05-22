class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    preload() {
        //animation plugin
        this.load.scenePlugin('AnimatedTiles', AnimatedTiles, "animatedTiles");

        this.load.path = "./assets/level/";
        //json tilemap created from Tiled
        //1st parameter is key indicator
        //2nd parameter is path to json
        this.load.tilemapTiledJSON("tilemap2", "room_1.json");
    }

    create() {
        //create tilemap
        //load the json file as a tilemap
        //parameter is key indicator from the json
        const map = this.add.tilemap("tilemap2");
        //create tileset from tilemapping 
        //1st parameter is Tiled name for tilesheet
        //2nd parameter is tilesheet key indicator from the png above
        const tileset = map.addTilesetImage("tileset", "tilesheet1");

        //create dynamic layers
        //creating static layers must be inverse order of what tiled has to display layers correctly
        //parameter must be Tiled name for layer
        const backgroundLayer = map.createDynamicLayer("Background", tileset, 0, 0);
        const wallLayer = map.createDynamicLayer("Wall", tileset, 0, 0);
        const wallDetailLayer = map.createDynamicLayer("Wall_Detail", tileset, 0, 0);
        const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
        const groundDetailLayer = map.createDynamicLayer("Ground_Detail", tileset, 0, 0);
        const spikeLayer = map.createDynamicLayer("Spikes", tileset, 0, 0);

        //init animations
        this.sys.animatedTiles.init(map);

        //create collisions for ground layer
        //property must be the same name as custom property in Tiled
        groundLayer.setCollisionByProperty({collides: true});
        spikeLayer.setCollisionByProperty({spikes: true});

        //npc
        let npcList = map.filterObjects("Objects", obj => obj.name == "jelly");
        this.jellyfish = this.add.group({runChildUpdate: true});

        let counter = 1;
        npcList.map((element) => {
            let npc = new Dialogue(this, element.x, element.y, "scroll", counter, "tutorial");
            this.jellyfish.add(npc);
            counter++;
        });

        //door
        const dSpawn = map.findObject("Objects", obj => obj.name == "doorEnd");
        this.door = new Door(this, dSpawn.x, dSpawn.y, "level1");

        //create spawn point for player
        const pSpawn = map.findObject("Objects", obj => obj.name == "playerSpawn");
        //create player 
        this.player = new Player(this, pSpawn.x, pSpawn.y, "level1");

        //bubble spawn
        const bSpawn = map.findObject("Objects", obj => obj.name == "bubbleSpawn");
        //create bubble
        this.bubble = new Bubble(this, bSpawn.x, bSpawn.y, "level1");

        //allow for player update and bubble update
        this.gameSprites = this.add.group({
            runChildUpdate: true,
        });
        this.gameSprites.add(this.player);
        this.gameSprites.add(this.bubble);

        //set up collision
        //ground collision
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.bubble, groundLayer);

        //bun x bub 
        this.physics.add.overlap(this.player, this.bubble, this.player.bubbleCollision, null, this.player);

        //spike collision
        this.physics.add.collider(this.bubble, spikeLayer, this.bubble.spikeCollision, null, this.bubble);

        //npc
        this.physics.add.overlap(this.player, this.jellyfish, this.talk, null, this);
        //scroll

        //door
        this.physics.add.overlap(this.player, this.door, this.door.doorCollision, null, this.door);

        //world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        let textConfig = {
            fontSize: "20px",
            align: "center"
        };

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(10, 5);
        this.cameras.main.setSize(640, 360);
    }

    update() {
        //this.sys.animatedTiles.updateAnimatedTiles();
    }

    talk(player, jelly) {
        jelly.dialogueBox.alpha = 1;
        jelly.text.alpha = 1;
    }
}