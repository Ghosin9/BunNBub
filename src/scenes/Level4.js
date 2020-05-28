//animated tiles library used from Richard Davey's https://github.com/nkholski/phaser-animated-tiles

class Level4 extends Phaser.Scene {
    constructor() {
        super("level4");
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

        this.load.path = "./assets/level/";
        //json tilemap created from Tiled
        //1st parameter is key indicator
        //2nd parameter is path to json
        this.load.tilemapTiledJSON("lv4", "room_4.json");
    }

    create() {
        //create tilemap
        //load the json file as a tilemap
        //parameter is key indicator from the json
        let map = this.add.tilemap("lv4");
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
        this.npcs = this.add.group({runChildUpdate: true});

        npcList.map((element) => {
            let npc = new Dialogue(this, element.x, element.y, "jelly", element.type, "level1");
            this.npcs.add(npc);
        });

        //scroll
        let scrollList = map.filterObjects("Objects", obj => obj.name == "scroll");

        scrollList.map((element) => {
            let npc = new Dialogue(this, element.x, element.y, "scroll", element.type, "level1");
            this.npcs.add(npc);
        });

        //door
        let dSpawn = map.findObject("Objects", obj => obj.name == "doorEnd");
        this.door = new Door(this, dSpawn.x, dSpawn.y, "level4", "level5");

        //turtle
        let turtleList = map.filterObjects("Objects", obj => obj.name == "turtleSpawn");
        this.turtles = this.add.group({runChildUpdate: true});

        turtleList.map((element) => {
            let turtle = new Turtle(this, element.x, element.y, element.type);
            this.turtles.add(turtle);
        });

        //geyser
        let geyserAList = map.filterObjects("Objects", obj => obj.name == "geyserASpawn");
        this.geysers = this.add.group({runChildUpdate: true});
        geyserAList.map((element) => {
            let geyser = new Geyser(this, element.x, element.y, "a");
            this.geysers.add(geyser);
        });

        let geyserBList = map.filterObjects("Objects", obj => obj.name == "geyserBSpawn");
        geyserBList.map((element) => {
            let geyser = new Geyser(this, element.x, element.y, "b");
            this.geysers.add(geyser);
        });

        //create spawn point for player
        let pSpawn = map.findObject("Objects", obj => obj.name == "playerSpawn");
        //create player 
        this.player = new Player(this, pSpawn.x, pSpawn.y, "level4");

        //bubble spawn
        let bSpawn = map.findObject("Objects", obj => obj.name == "bubbleSpawn");
        //create bubble
        this.bubble = new Bubble(this, bSpawn.x, bSpawn.y, "level4");

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
        this.physics.add.overlap(this.player, this.npcs, this.talk, null, this);
        //scroll

        //turtle
        this.physics.add.collider(this.player, this.turtles, this.playerTurtle, null, this);
        this.physics.add.collider(this.bubble, this.turtles, this.bubbleTurtle, null, this);

        //geyser
        this.physics.add.overlap(this.bubble, this.geysers, this.geyserPush, null, this);

        //door
        this.physics.add.overlap(this.player, this.door, this.door.doorCollision, null, this.door);

        //world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

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
        this.scrollCount = this.add.text(555, 25, this.scrolls + "/5", scrollText).setOrigin(0).setScrollFactor(0);

        this.sound.play("bg4", {volume: 0.1, loop: true});
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
                        this.scrollCount.text = this.scrolls + "/5";
                    }
                    break;
                case 2:
                    if(!jelly.talking) {
                        this.sound.play("scroll2");
                        jelly.talking = true;
                        ++this.scrolls;
                        this.scrollCount.text = this.scrolls + "/5";
                    }
                    break;
            }
        }
    }

    geyserPush(bubble, geyser) {
        if(!this.player.holding) {
            bubble.setVelocityY(game.settings.geyserSpeed);
        }
    }

    playerTurtle(player, turtle){

        if(turtle.body.touching.up) {
            player.canJump = true;
        }

        if(player.fallingSound){
            this.sound.play("playerLand", {volume: 0.25});
            player.fallingSound = false;
        }

        //move player with platform
        if(!turtle.flipped) {
            player.x -= 0.86;
        } else if (turtle.flipped){
            player.x += 0.86;
        }
    }

    bubbleTurtle(bubble, turtle) {
        //move bubble with platform
        if(!turtle.flipped) {
            bubble.x -= 0.86;
        } else if (turtle.flipped){
            bubble.x += 0.86;
        }
    }
}