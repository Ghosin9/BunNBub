class Geyser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        if (type == "a") {
            super(scene, x, y, "geyser_a", "geyser_a1").setOrigin(0);

            //idle
            this.scene.anims.create({
                key: "gAIdle",
                frames: this.scene.anims.generateFrameNames("geyser_a", {
                    prefix: "geyser_a",
                    start: 1,
                    end: 4,
                }),
                repeat: -1,
                frameRate: 3,
            });

            this.anims.play("gAIdle");

        } else { //type == b
            super(scene, x, y, "geyser_b", "geyser_b1").setOrigin(0);

            //idle
            this.scene.anims.create({
                key: "gBIdle",
                frames: this.scene.anims.generateFrameNames("geyser_b", {
                    prefix: "geyser_b",
                    start: 1,
                    end: 4,
                }),
                repeat: -1,
                frameRate: 3,
            });
            this.anims.play("gBIdle");
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene = scene;
        this.inView = false;
        this.waterSound = true;
    }

    update() {
        if(this.body.touching.none) {
            this.scene.bubble.setAccelerationY(0);
        }
    }
}