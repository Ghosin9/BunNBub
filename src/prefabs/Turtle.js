class Turtle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, numTiles) {
        super(scene, x, y, "turtle", "turtle_1").setOrigin(1, 0);

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //set immovable and no gravity
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        //properties
        this.scene = scene;
        //number of tiles that the turtle travels
        this.numTiles = numTiles*16;
        //counter telling the progress of the turtle
        this.counter = 0;
        //flipped animation
        this.flipped = false;

        //swimming animation
        this.scene.anims.create({
            key: "tIdle",
                frames: this.scene.anims.generateFrameNames("turtle", {
                    prefix: "turtle_",
                    start: 1,
                    end: 2,
                }),
                repeat: -1,
                frameRate: 3,
        });

        //play animation
        this.anims.play("tIdle");

        //move at a consistent speed, but because of different distances traveled, some turtles will flip at different rates
        this.scene.time.addEvent({
            delay: 5,
            callback: this.move,
            callbackScope: this,
            loop: true,
        });

        //move at different speed, but all complete area at the same time.
        // let moveTween = this.scene.tweens.add({
        //     targets: this,
        //     x: this.x-this.numTiles,
        //     ease: "Linear",
        //     duration: 3000,
        //     repeat: -1,
        //     yoyo: true,
        //     paused: true,
        // });
        // moveTween.play();
    }

    update() {
        
    }

    move() {
        //counting the number of tiles
        if(this.counter < this.numTiles){
            //move left if not flipped
            if(!this.flipped) {
                --this.x;
                this.setFlipX(this.flipped);
            } else { //move right if flipped
                ++this.x;
                this.setFlipX(this.flipped);
            }
            //increase counter
            ++this.counter;
        } else {
            //if you reach the needed number of tiles traveled, flip the turtle
            this.counter = 0;
            this.flipped = !this.flipped;
        }
    }
}