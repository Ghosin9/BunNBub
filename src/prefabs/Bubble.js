class Bubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "bubble", "bubble_1");

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //properties
        this.scene = scene;
        //play the bubble sound
        this.bubbleSound = true;
        //play the pop sound
        this.popSound = true;
        this.cameraMain = this.scene.cameras.main;

        //physics
        this.setCollideWorldBounds(true);
        this.setCircle(8);
        //decceleration
        this.setDragX(100);
        //max velocity
        this.setMaxVelocity(200, 1000);
        //bounce
        this.setBounce(0.5, 0.90);

        //animation
        //idle
        this.scene.anims.create({
            key: "bIdle",
            frames: this.scene.anims.generateFrameNames("bubble", {
                prefix: "bubble_",
                start: 1,
                end: 4,
            }),
            frameRate: 6,
            repeat: -1,
        });

        //pop
        this.scene.anims.create({
            key: "bPop",
            frames: this.scene.anims.generateFrameNames("bubblepop", {
                prefix: "bubble_pop",
                start: 1,
                end: 10,
            }),
            frameRate: 6,
        })

        //play animation
        this.anims.play("bIdle", true);
    }

    update(time, delta) {
        super.update();

        //replay bubble landing sound
        if(this.body.velocity.y >= 0) {
            this.bubbleSound = true;

            //max velocity
            if(this.body.velocity.y > 150) {
                this.setVelocityY(150);
            }
        }

        //bubble landing sound
        if(this.body.blocked.down && this.bubbleSound && this.popSound) {
            this.scene.sound.play("bubbleLand");
            this.bubbleSound = false;
        }

        if(!this.anims.isPlaying) {
            //restart level
            this.scene.scene.start(game.settings.currentLevel);
            this.scene.sound.stopAll();
            //this.destroy();
        }

        //if the player is not holding, allow gravity
        if(!this.scene.player.holding) {
            this.body.setAllowGravity(true);
        }
    }

    spikeCollision(bubble, spike) {
        //play the pop sound, not overlapping
        if(this.popSound) {
            this.scene.sound.play("pop");
            this.popSound = false;
        }

        //set holding to false
        this.scene.player.holding = false;

        //stop the physics body
        this.body.stop();
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        //play the pop animation
        this.anims.play("bPop", true);
    }
}