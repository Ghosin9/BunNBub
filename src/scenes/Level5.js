//animated tiles library used from Richard Davey's https://github.com/nkholski/phaser-animated-tiles

class Level5 extends Phaser.Scene {
    constructor() {
        super("level5");
    }

    preload() {
        //animation plugin
        this.load.scenePlugin('AnimatedTiles', AnimatedTiles, "animatedTiles");

        this.load.path = "./assets/level/";
        //png of tilesheet
        //1st parameter is key indicator
        //2nd parameter is path to png
        this.load.spritesheet("tilesheet2", "tilesheet_2.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.path = "./assets/level/";
        //json tilemap created from Tiled
        //1st parameter is key indicator
        //2nd parameter is path to json
        this.load.tilemapTiledJSON("lv5", "room_5.json");
    }

    create() {
        //create tilemap
        //load the json file as a tilemap
        //parameter is key indicator from the json
        let map = this.add.tilemap("lv5");
        //create tileset from tilemapping 
        //1st parameter is Tiled name for tilesheet
        //2nd parameter is tilesheet key indicator from the png above
        let tileset = map.addTilesetImage("tileset_2", "tilesheet2");

        game.settings.currentLevel = "level5";

        //create dynamic layers
        //creating static layers must be inverse order of what tiled has to display layers correctly
        //parameter must be Tiled name for layer
        let backgroundLayer = map.createDynamicLayer("Background", tileset, 0, 0);
        let wallLayer = map.createDynamicLayer("Wall", tileset, 0, 0);
        let wallDetailLayer = map.createDynamicLayer("Wall_Detail", tileset, 0, 0);
        let groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
        let groundDetailLayer = map.createDynamicLayer("Ground_Detail", tileset, 0, 0);

        //init animations
        this.sys.animatedTiles.init(map);

        //create collisions for ground layer
        //property must be the same name as custom property in Tiled
        groundLayer.setCollisionByProperty({collides: true});

        //create spawn point for player
        let pSpawn = map.findObject("Objects", obj => obj.name == "playerSpawn");
        //create player 
        this.player = new Player(this, pSpawn.x, pSpawn.y, game.settings.currentLevel);

        //bubble spawn
        let bSpawn = map.findObject("Objects", obj => obj.name == "bubbleSpawn");
        //create bubble
        this.bubble = new Bubble(this, bSpawn.x, bSpawn.y, game.settings.currentLevel);

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

        //world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(10, 5);
        this.cameras.main.setSize(640, 360);
        this.cameras.main.roundPixels = true;

        //remove music
        this.sound.stopAll();

        //play background music
        this.sound.play("bgend", {volume: 0.2, loop: true});

        //adding guppy
        let gSpawn = map.findObject("Objects", obj => obj.name == "guppySpawn");

        this.guppy = this.physics.add.sprite(gSpawn.x, gSpawn.y, "guppy", "guppy_1");
        this.guppy.body.setAllowGravity(false);
        //this.guppy.setImmovable(true);
        
        this.anims.create({
            key: "guppyIdle",
            frames: this.anims.generateFrameNames("guppy", {
                prefix: "guppy_",
                start: 1,
                end: 3,
            }),
            repeat: -1,
            frameRate: 3,
        });

        this.anims.create({
            key: "guppyWalk",
            frames: this.anims.generateFrameNames("guppy", {
                prefix: "guppy_walk_",
                start: 1,
                end: 3,
            }),
            repeat: -1,
            frameRate: 3,
        });

        //cutscene shit
        this.bars = this.add.image(0, 0, "bars").setOrigin(0).setAlpha(0).setScrollFactor(0);

        //right arrow
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.playingCutscene = false;
        this.cameraZoom = true;
        this.finishedCutscene = false;
        this.counter = 1;
        this.ending = false;
        this.inEnding = false;
        this.nextText = false;

        this.cameras.main.once("camerazoomcomplete", () => {
            this.bars.setAlpha(0);
            this.cameras.main.fadeOut(500, 255, 255, 255);
        });

        this.cameras.main.once("camerafadeoutcomplete", () => {
            if(!this.ending) {
                game.scene.pause(game.settings.currentLevel);
                game.scene.moveDown(game.settings.currentLevel);
                game.scene.start("endcutscene");
                this.cameras.main.fadeIn(1000);
                this.cameras.main.zoomTo(1, 2000, "Quad.easeIn");
                this.bars.setAlpha(1);
                this.cutscene();
            }
        });
    }

    update() {
        if(this.player.x <= 375) {
            this.playingCutscene = true;
            this.player.control = false;

            this.player.holding = false;
            this.player.anims.play("idle", true);
            this.player.setVelocityX(0);
            this.player.setAccelerationX(0);

            this.sound.removeByKey("bunwalk");
            this.sound.removeByKey("bgend");
        }

        if(this.playingCutscene) {
            this.bars.setAlpha(1);
            if(this.guppy.x < 175) {
                this.guppy.anims.play("guppyWalk", true);
                this.guppy.x += 1.5;
            } else {
                this.guppy.anims.play("guppyIdle", true);
                if(this.cameraZoom) {
                    this.cameraZoom = false;

                    this.cameras.main.startFollow(this.guppy, true, 0.1, 0.1);
                    this.cameras.main.zoomTo(5, 2000, "Quad.easeIn");
                }
            }
        }

        if(this.finishedCutscene && this.nextText && Phaser.Input.Keyboard.JustDown(this.right)) {
            switch(this.counter) {
                case 1:
                    this.text.text = "I will avenge all who have fallen."
                    break;
                case 2:
                    this.text.setAlpha(0);
                    this.bars.setAlpha(0);
                    this.ending = true;
                    break;
            }

            ++this.counter;
        }

        if(this.ending) {

            if(!this.inEnding) {
                this.guppy.anims.play("guppyWalk", true);
                this.guppy.setVelocityX(275);
                this.guppy.setVelocityY(-600);
                this.guppy.body.setAllowGravity(true);

                this.cameras.main.stopFollow();
                this.cameras.main.fadeOut(750, 255, 255, 255);
                this.arrow.setAlpha(0);
                this.inEnding =true;

                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.time.addEvent({
                        delay: 2000,
                        callback: () => {
                            this.scene.start("credits");
                        },
                        callbackScope: this,
                    });
                });
            }
        }
    }

    cutscene() {
        this.finishedCutscene = true;
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

        this.cameras.main.once("camerazoomcomplete", () => {
            this.nextText = true;
        });

        this.textContents = "You monster…";
        this.cameras.main.shake(1000000000, 0.0009);
        this.text = this.add.text(5, 25, this.textContents, textConfig).setOrigin(0).setScrollFactor(0);
        this.arrow = this.add.image(0, 0, "arrow").setOrigin(0).setScrollFactor(0);
    }
}