class Bubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, currentLevel) {
        super(scene, x, y, "bubble", "bubble_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.bubbleSound = true;
        this.popSound = true;
        this.currentLevel = currentLevel;
        this.cameraMain = this.scene.cameras.main;

        //physics
        this.setCollideWorldBounds(true);
        this.setCircle(8);
        //decceleration
        this.setDragX(100);
        //max velocity
        this.setMaxVelocity(200, 150);
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
        if(this.body.velocity.y >= 0)
            this.bubbleSound = true;

        //bubble landing sound
        if(this.body.blocked.down && this.bubbleSound && this.popSound) {
            this.scene.sound.play("bubbleLand");
            this.bubbleSound = false;
        }

        if(!this.anims.isPlaying) {
            //restart level
            this.scene.scene.start(this.currentLevel);
            //this.destroy();
        }
    }

    spikeCollision(bubble, spike) {
        if(this.popSound) {
            this.scene.sound.play("pop");
            this.popSound = false;
        }

        this.scene.player.holding = false;
        this.body.stop();
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        this.anims.play("bPop", true);
    }
}