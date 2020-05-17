class Bubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "bubble", "bubble_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;

        //physics
        this.body.setCircle(8);
        //decceleration
        this.setDragX(200);
        //max velocity
        this.setMaxVelocity(450, 150);
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
    }
}