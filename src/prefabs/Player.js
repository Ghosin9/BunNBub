class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,) {
        super(scene, x, y, "player", "sbunny_idle_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.scene = scene;
        this.fallingSound = true;
        this.holding = false;

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
        this.grab = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.restart = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //physics
        //slows player down 
        this.setDragX(2000);
        //world bounds
        this.setCollideWorldBounds(true);
        //max velocity
        this.setMaxVelocity(200, 700);
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
            if(!this.holding)
                this.anims.play("walk", true);
        } else if (this.cursors.right.isDown) {
            this.setFlipX(true);
            this.setAccelerationX(700);

            //allows for almost immediate direction change
            if(this.body.velocity.x <= 0)
                this.body.velocity.x = 0;

            //play animation
            if(!this.holding)
                this.anims.play("walk", true);
        } else {
            this.setAccelerationX(0);

            //play animation
            if(!this.holding)
                this.anims.play("idle", true);
        }

        //jumping
        if((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) 
            && this.body.blocked.down && this.grab.isUp){
            this.setVelocityY(-700);
            this.setAccelerationY(500);
        }

        //landing sound
        if(this.body.blocked.down && this.fallingSound) {
            this.scene.sound.play("playerLand", {volume: 0.25});
            this.fallingSound = false;
        }

        //play jumping or falling animation
        if(this.body.velocity.y < 0) {
            this.anims.play("jump", true);
        } else if (this.body.velocity.y > 0) {
            this.anims.play("fall", true);
            this.fallingSound = true;
        }

        if(this.grab.isUp)
            this.holding = false;

        //restart
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.scene.start("level1");
        }
    }

    bubbleCollision(bunny, bubble) {

        if(Phaser.Input.Keyboard.JustDown(this.grab)){
            this.scene.sound.play("push");
        }

        if(this.grab.isDown) {
            this.holding = true;

            bubble.y = bunny.y;

            bunny.anims.play("push", true);

            if(bunny.flipX){
                bubble.x = bunny.x + bunny.width/2;
            } else {
                bubble.x = bunny.x - bunny.width/2;
            }

            bubble.body.setVelocityX(bunny.body.velocity.x);

            //console.log("up");

            // this.bunnyX = bunny.x;
            // this.bubbleX = bubble.x;

            //console.log("bubble x: " + this.bubbleX);
            //console.log("bunny x: " + this.bunnyX);

            //min speed of 10
            // if(bunny.body.velocity.y < 5)
            //     this.speed = 10;
            // else
            // this.speed = 200;

            //if bubble is to the right
            // if(this.bubbleX >= this.bunnyX) {
            //     //eject to the right
            //     //console.log("ejecting right");

            //     //if blocked to the right, actually eject to the left
            //     if (bubble.body.blocked.right) {
            //         this.speed = -this.speed;
            //         //console.log("blocked right, ejecting left");
            //     }
            // } else {
            //     //eject to the left
            //     //console.log("ejecting left");

            //     //if blocked to the left, actually eject to the right
            //     if(bubble.body.blocked.left) {
            //         //console.log("blocked left, ejecting right");
            //     } else {
            //         this.speed = -this.speed;
            //     }
            // }

            // //ejection
            // bubble.body.setVelocityX(this.speed);
        }
    }
}