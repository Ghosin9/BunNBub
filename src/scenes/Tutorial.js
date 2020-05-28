//animated tiles library used from Richard Davey's https://github.com/nkholski/phaser-animated-tiles

class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorial");
    }

    preload() {
        //animation plugin
        this.load.scenePlugin('AnimatedTiles', AnimatedTiles, "animatedTiles");

        this.load.path = "./assets/level/";
        //png of tilesheet
        //1st parameter is key indicator
        //2nd parameter is path to png
        this.load.spritesheet("tilesheet", "tilesheet.png", {
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
        let map = this.add.tilemap("tilemap1");
        //create tileset from tilemapping 
        //1st parameter is Tiled name for tilesheet
        //2nd parameter is tilesheet key indicator from the png above
        let tileset = map.addTilesetImage("tileset", "tilesheet");

        //create dynamic layers
        //creating static layers must be inverse order of what tiled has to display layers correctly
        //parameter must be Tiled name for layer
        let backgroundLayer = map.createDynamicLayer("Background", tileset, 0, 0);
        let wallLayer = map.createDynamicLayer("Wall", tileset, 0, 0);
        let wallDetailLayer = map.createDynamicLayer("Wall_Detail", tileset, 0, 0);
        let groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
        let groundDetailLayer = map.createDynamicLayer("Ground_Detail", tileset, 0, 0);
        let spikeLayer = map.createDynamicLayer("Spikes", tileset, 0, 0);

        //init animations
        this.sys.animatedTiles.init(map);

        //create collisions for ground layer
        //property must be the same name as custom property in Tiled
        groundLayer.setCollisionByProperty({collides: true});
        spikeLayer.setCollisionByProperty({collides: true});

        //npc
        let npcList = map.filterObjects("Objects", obj => obj.name == "jelly");
        this.jellyfish = this.add.group({runChildUpdate: true});

        npcList.map((element) => {
            let npc = new Dialogue(this, element.x, element.y, "jelly", element.type, "tutorial");
            this.jellyfish.add(npc);
        });

        //door
        let dSpawn = map.findObject("Objects", obj => obj.name == "doorEnd");
        this.door = new Door(this, dSpawn.x, dSpawn.y, "tutorial", "level1");

        //create spawn point for player
        let pSpawn = map.findObject("Objects", obj => obj.name == "playerSpawn");
        this.player = new Player(this, pSpawn.x, pSpawn.y, "tutorial");

        //bubble spawn
        let bSpawn = map.findObject("Objects", obj => obj.name == "bubbleSpawn");
        this.bubble = new Bubble(this, bSpawn.x, bSpawn.y, "tutorial");

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

        //door
        this.physics.add.overlap(this.player, this.door, this.door.doorCollision, null, this.door);

        //world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        //temp instruction text
        // this.hold = this.add.text(0, 0, "PRESS X TO GRAB", textConfig).setOrigin(0).setScrollFactor(0);
        // this.arrow = this.add.text(0, 15, "ARROW KEYS TO MOVE", textConfig).setOrigin(0).setScrollFactor(0);
        // this.r = this.add.text(0, 30, "R TO RESTART", textConfig).setOrigin(0).setScrollFactor(0);
        // this.e = this.add.text(0, 45, "Z TO VIEW MAP", textConfig).setOrigin(0).setScrollFactor(0);
        // this.control = this.add.text(0, 60, "CONTROL MAP WITH ARROW KEYS", textConfig).setOrigin(0).setScrollFactor(0);
        // this.spikes = this.add.text(0, 75, "SPIKES ONLY HURT BUBBLE", textConfig).setOrigin(0).setScrollFactor(0);

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(10, 5);
        this.cameras.main.setSize(640, 360);

        let scrollText = {
            fontFamily: "Helvetica",
            fontSize: "20px",
            color: "#ffffff",
            align: "left",
        }

        //scroll indicator
        this.scrolls = 0;
        this.scrollCountImage = this.add.image(520, 8, "scrollCounter").setOrigin(0).setScrollFactor(0);
        this.scrollCount = this.add.text(555, 25, this.scrolls + "/0", scrollText).setOrigin(0).setScrollFactor(0);

        this.sound.play("bgtut", {volume: 0.2, loop: true});
    }

    update() {
        //this.sys.animatedTiles.updateAnimatedTiles();
    }

    talk(player, jelly) {
        jelly.dialogueBox.alpha = 1;
        jelly.text.alpha = 1;

        if(jelly.type == "jelly") {
            if(!jelly.talking) {
                this.sound.play("jellytalk", {volume: 0.2, loop: true});
                jelly.talking = true;
            }
        } else {
            this.random = Phaser.Math.Between(1, 2);
            switch(this.random) {
                case 1:
                    if(!jelly.talking) {
                        this.sound.play("scroll1");
                        jelly.talking = true;
                        ++this.scrolls;
                        this.scrollCount.text = this.scrolls + "/2";
                    }
                    break;
                case 2:
                    if(!jelly.talking) {
                        this.sound.play("scroll2");
                        jelly.talking = true;
                        ++this.scrolls;
                        this.scrollCount.text = this.scrolls + "/2";
                    }
                    break;
            }
        }
    }
}