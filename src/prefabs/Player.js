class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, currentLevel) {
        super(scene, x, y, "player", "sbunny_idle_1");

        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.scene = scene;
        this.fallingSound = true;
        this.holding = false;
        this.currentLevel = currentLevel;
        this.canJump = true;
        this.walking = false;

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
        this.grab = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.zoom = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.restart = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.pause = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

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

        //restart
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.scene.start(this.currentLevel);

            //remove music
            switch(this.currentLevel) {
                case "tutorial":
                    this.scene.sound.removeByKey("bgtut");
                    break;
                case "level1":
                    this.scene.sound.removeByKey("bg1");
                    break;
                case "level2":
                    this.scene.sound.removeByKey("bg2");
                    break;
                case "level3":
                    this.scene.sound.removeByKey("bg3");
                    break;
                case "level4":
                    this.scene.sound.removeByKey("bg4");
                    break;
                case "level5":
                    this.scene.sound.removeByKey("bgend");
                    break;
            }
        }

        //pause
        if(Phaser.Input.Keyboard.JustDown(this.pause)) {
            game.scene.pause(this.currentLevel);
            game.scene.start("pause");
            game.scene.moveDown(this.currentLevel);
        }

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

                if(this.walking && this.body.blocked.down) {
                    this.scene.sound.play("bunwalk", {loop: true});
                    this.walking = false;
                }
            } else if (this.cursors.right.isDown) {
                this.setFlipX(true);
                this.setAccelerationX(700);

                //allows for almost immediate direction change
                if(this.body.velocity.x <= 0)
                    this.body.velocity.x = 0;

                //play animation
                if(!this.holding)
                    this.anims.play("walk", true);

                if(this.walking && this.body.blocked.down) {
                    this.scene.sound.play("bunwalk", {loop: true});
                    this.walking = false;
                }
            } else {
                this.setAccelerationX(0);

                //play animation
                if(!this.holding)
                    this.anims.play("idle", true);

                this.walking = true;
                this.scene.sound.removeByKey("bunwalk");
            }

            //jumping
            if((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) 
                && this.canJump){
                    this.canJump = false;
                    if(this.holding) {
                        this.setVelocityY(-570);
                        this.setAccelerationY(300);
                    } else {
                        this.setVelocityY(-700);
                        this.setAccelerationY(300);
                    }
            }

            //play jumping or falling animation
            if(this.body.velocity.y < 0) {
                this.anims.play("jump", true);
                this.setOffset(0, 0);
                this.walking = true;
                this.scene.sound.removeByKey("bunwalk");
            } else if (this.body.velocity.y > 0) {
                this.anims.play("fall", true);
                this.fallingSound = true;
                this.walking = true;
                this.scene.sound.removeByKey("bunwalk");
            }

            //landing sound
            if(this.body.blocked.down && this.fallingSound) {
                this.scene.sound.play("playerLand", {volume: 0.25});
                this.fallingSound = false;
                this.canJump = true;
            }

            //camera mode
            if (Phaser.Input.Keyboard.JustDown(this.zoom)) {
                this.cameraMode();
            }

            //if touching nothing
            if(this.body.touching.none) {
                this.holding = false;
            }
        } else {
            this.camControl.update(delta);

            if (Phaser.Input.Keyboard.JustDown(this.zoom)) {
                this.camera = false;
                this.scene.cameras.main.startFollow(this, true, 0.1, 0.1);
                this.scene.cameras.main.setSize(640, 360);
                this.scene.cameras.main.setZoom(1);

                this.scene.scrollCountImage.alpha = 1;
                this.scene.scrollCount.alpha = 1;
            }
        }
    }

    bubbleCollision(bunny, bubble) {
        if (Phaser.Input.Keyboard.JustDown(this.grab)) {
            if (this.holding) {
                this.holding = false;
            } else {
                this.holding = true;
            }
        }

        if(this.holding) {
            bubble.body.setAllowGravity(false);
            bubble.setAccelerationY(0);
            
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
        } else {
            bubble.body.setAllowGravity(true);
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
        this.scene.cameras.main.setZoom(0.75);

        this.scene.scrollCountImage.alpha = 0;
        this.scene.scrollCount.alpha = 0;

        this.camControl = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    }
}