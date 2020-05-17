class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,) {
        super(scene, x, y, "player", "sbunny_idle_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.scene = scene;

        //animation
        //idle
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNames("player", {
                prefix: "sbunny_idle_",
                start: 1,
                end: 5,
            }),
            repeat: -1,
            frameRate: 6,
        });

        //walking
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNames("player", {
                prefix: "sbunny_run_",
                start: 1,
                end: 4,
            }),
            repeat: -1,
            frameRate: 12,
        });
        this.anims.play("idle");

        //push
        this.scene.anims.create({
            key: "push",
            frames: this.scene.anims.generateFrameNames("player", {
                prefix: "sbunny_push_",
                start: 1,
                end: 2,
            }),
            repeat: -1,
            frameRate: 3,
        });

        //jump
        this.scene.anims.create({
            key: "jump",
            defaultTextureKey: "player",
            frames: [
                {frame: "sbunny_jump"},
            ]
        });

        //fall
        this.scene.anims.create({
            key: "fall",
            defaultTextureKey: "player",
            frames: [
                {frame: "sbunny_fall"},
            ]
        });

        //player controls
        this.cursors = scene.input.keyboard.createCursorKeys();

        //physics
        //slows player down 
        this.setDragX(2000);
        //world bounds
        this.setCollideWorldBounds(true);
        //max velocity
        this.setMaxVelocity(250, 800);
    }

    update() {
        super.update();

        //left right
        if(this.cursors.left.isDown){
            this.setFlipX(false);
            this.setAccelerationX(-700);

            //allows for almost immediate direction change
            if(this.body.velocity.x >= 0)
                this.body.velocity.x = 0;

            //play animation
            if(this.body.blocked.left || this.body.touching.left)
                this.anims.play("push", true);
            else
                this.anims.play("walk", true);
        } else if (this.cursors.right.isDown) {
            this.setFlipX(true);
            this.setAccelerationX(700);

            //allows for almost immediate direction change
            if(this.body.velocity.x <= 0)
                this.body.velocity.x = 0;

            //play animation
            if(this.body.blocked.right || this.body.touching.right)
                this.anims.play("push", true);
            else
                this.anims.play("walk", true);
        } else {
            this.setAccelerationX(0);

            //play animation
            this.anims.play("idle", true);
        }

        //jumping
        if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.body.blocked.down){
            this.setVelocityY(-700);
            this.setAccelerationY(500);
        }

        //play jumping or falling animation
        if(this.body.velocity.y < 0) {
            this.anims.play("jump", true);
        } else if (this.body.velocity.y > 0) {
            this.anims.play("fall", true);
        }
    }
}