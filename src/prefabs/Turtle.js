class Turtle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, numTiles) {
        super(scene, x, y, "turtle", "turtle_1").setOrigin(1, 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene = scene;
        this.numTiles = numTiles*16;
        this.counter = 0;
        this.flipped = false;

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

        this.anims.play("tIdle");

        //move at a consistent speed, but 
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
        if(this.counter < this.numTiles){
            if(!this.flipped) {
                --this.x;
                this.setFlipX(this.flipped);
            } else {
                ++this.x;
                this.setFlipX(this.flipped);
            }
            ++this.counter;
        } else {
            this.counter = 0;
            this.flipped = !this.flipped;
        }
    }
}