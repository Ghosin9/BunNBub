class Bubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "bubble", "bubble_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.bubbleSound = true;

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

        //play animation
        this.anims.play("bIdle");
    }

    update() {
        super.update();

        //replay bubble landing sound
        if(this.body.velocity.y >= 0)
            this.bubbleSound = true;

        //bubble landing sound
        if(this.body.blocked.down && this.bubbleSound) {
            this.scene.sound.play("bubbleLand");
            this.bubbleSound = false;
        }
    }

    spikeCollision(bubble, spike) {
        this.sound.play("pop");

        bubble.destroy();
    }
}