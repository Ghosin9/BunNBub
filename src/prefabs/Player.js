class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 50, 50, "player", "bunny_idle_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.scene = scene;

        //animation
        //idle
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNames("player", {
                prefix: "bunny_idle_",
                start: 1,
                end: 5,
            }),
            repeat: -1,
        });

        //walking
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNames("player", {
                prefix: "bunny_run_",
                start: 1,
                end: 4,
            }),
            repeat: -1,
        });

        this.idle = true;
        this.walk = false;

        //player controls
        this.cursors = scene.input.keyboard.createCursorKeys();

        //physics
        //slows player down 
        this.setDragX(2000);
        //world bounds
        this.setCollideWorldBounds(true);
        //max velocity
        this.setMaxVelocity(350, 800);
    }

    update() {
        if(this.cursors.left.isDown){
            this.setFlipX(false);
            this.setAccelerationX(-700);

            //allows for almost immediate direction change
            if(this.body.velocity.x >= 0)
                this.body.velocity.x = 0;

            //play animation
            if(this.walk) {
                this.anims.play("walk");
                this.walk = false;
                this.idle = true;
            }
        } else if (this.cursors.right.isDown) {
            this.setFlipX(true);
            this.setAccelerationX(700);

            //allows for almost immediate direction change
            if(this.body.velocity.x <= 0)
                this.body.velocity.x = 0;

            //play animation
            if(this.walk) {
                this.anims.play("walk");
                this.walk = false;
                this.idle = true;
            }
        } else {
            this.setAccelerationX(0);

            //play animation
            if(this.idle) {
                this.anims.play("idle");
                this.idle = false;
                this.walk = true;
            }
        }

        //jumping
        if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.body.blocked.down){
            this.setVelocityY(-700);
        }
    }
}