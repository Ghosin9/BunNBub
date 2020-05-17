class Level_1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    preload() {
        this.load.path = "./assets/";
        //png of tilesheet
        //1st parameter is key indicator
        //2nd parameter is path to png
        this.load.spritesheet("tilesheet", "tiles.png", {
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
        const tileset = map.addTilesetImage("tutorial", "tilesheet");

        //create static layers
        //creating static layers must be inverse order of what tiled has to display layers correctly
        //parameter must be Tiled name for layer
        const backgroundLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const groundLayer = map.createStaticLayer("Ground", tileset, 0, 0);

        //create collisions for ground layer
        //property must be the same name as custom property in Tiled
        groundLayer.setCollisionByProperty({collides: true});

        //create spawn point for player
        const pSpawn = map.findObject("Objects", obj => obj.name == "Spawn1");
        //create player
        this.player = new Player(this, pSpawn.x, pSpawn.y);

        //bubble spawn
        const bSpawn = map.findObject("Objects", obj => obj.name == "BubbleSpawn1");
        //create bubble
        this.bubble = new Bubble(this, bSpawn.x, bSpawn.y);

        //set up collision
        //ground collision
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.bubble, groundLayer);

        //bun x bub 
        this.physics.add.collider(this.player, this.bubble, this.bubbleCollision, null, this);

        //world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        //set up camera to follow player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(10, 5);
    }

    update() {
        this.player.update();

        this.bubble.update();
    }

    bubbleCollision(bunny, bubble) {
        bubble.body.setVelocityX(bunny.body.velocity.x*1.20);

        if(bubble.body.touching.up) {

            console.log("up");

            this.bunnyX = bunny.x;
            this.bubbleX = bubble.x;

            //console.log("bubble x: " + this.bubbleX);
            //console.log("bunny x: " + this.bunnyX);

            //min speed of 10
            // if(bunny.body.velocity.y < 5)
            //     this.speed = 10;
            // else
                this.speed = 200;

            //if bubble is to the right
            if(this.bubbleX >= this.bunnyX) {
                //eject to the right
                //console.log("ejecting right");

                //if blocked to the right, actually eject to the left
                if (bubble.body.blocked.right) {
                    this.speed = -this.speed;
                    //console.log("blocked right, ejecting left");
                }
            } else {
                //eject to the left
                //console.log("ejecting left");

                //if blocked to the left, actually eject to the right
                if(bubble.body.blocked.left) {
                    //console.log("blocked left, ejecting right");
                } else {
                    this.speed = -this.speed;
                }
            }

            //ejection
            bubble.body.setVelocityX(this.speed);
        } else if (bubble.body.touching.down) {
            console.log("down");
        }
    }
}