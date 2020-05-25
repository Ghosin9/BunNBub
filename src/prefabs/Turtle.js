class Turtle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, numTiles) {
        super(scene, x, y, "turtle", "turtle_1").setOrigin(1, 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene = scene;
        this.numTiles = numTiles*16;

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
    }

    update() {
        //move left and right depending on the points given
    }
}