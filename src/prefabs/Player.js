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
        this.zoom = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //camera mode
        this.camera = false;

        //physics
        //slows player down 
        this.setDragX(2000);
        //world bounds
        this.setCollideWorldBounds(true);
        //max velocity
        this.setMaxVelocity(200, 700);
    }

    update(time, delta) {
        super.update();

        if(!this.camera) {

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

            if(this.grab.isUp) {
                this.holding = false;
            }

            //restart
            if (Phaser.Input.Keyboard.JustDown(this.restart)) {
                this.scene.scene.start("level1");
            }

            //camera mode
            if (Phaser.Input.Keyboard.JustDown(this.zoom)) {
                this.cameraMode();
            }
        } else {
            this.camControl.update(delta);

            if (Phaser.Input.Keyboard.JustDown(this.zoom)) {
                this.camera = false;
                this.scene.cameras.main.startFollow(this, true, 0.1, 0.1);
                this.scene.cameras.main.setSize(640, 360);
                this.scene.cameras.main.setZoom(1);
            }
        }
    }

    bubbleCollision(bunny, bubble) {

        if(this.holding) {
            bubble.body.setAllowGravity(false);
        } else {
            bubble.body.setAllowGravity(true);
        }

        if(Phaser.Input.Keyboard.JustDown(this.grab)){
            this.scene.sound.play("push");
        }

        if(this.grab.isDown) {
            this.holding = true;

            bubble.y = bunny.y;

            bunny.anims.play("push", true);

            //if not on the wall. 
            if(!bubble.body.onWall()) {
                if(bunny.flipX){
                    bubble.x = bunny.x + bunny.width/2 + 4;
                } else {
                    bubble.x = bunny.x - bunny.width/2 - 4;
                }
            }

            bubble.body.setVelocityX(bunny.body.velocity.x);
            bubble.body.setVelocityY(bunny.body.velocity.y);

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

    cameraMode() {

        this.camera = true;

        this.body.setAccelerationX(0);
        this.body.setVelocityX(0);
        this.anims.play("idle", true);

        //https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FixedController.js Nathan Altice
        let controlConfig = {
            camera: this.scene.cameras.main,      // which camera?
            left: this.cursors.left,             // define keys...
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: { x: 0.4, y: 0.4}         // set speed of camera (keep values low)
        }

        this.scene.cameras.main.stopFollow();
        this.scene.cameras.main.setZoom(0.5);

        this.camControl = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    }
}