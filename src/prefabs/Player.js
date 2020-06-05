class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player", "sbunny_idle_1");

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        //properties
        this.scene = scene;
        //play falling sound
        this.fallingSound = true;
        //are you holding the bubble?
        this.holding = false;
        //can you jump
        this.canJump = true;
        //play the walking sound
        this.walking = false;
        //do u have control of the player at all?
        this.control = true;
        //camera mode
        this.camera = false;

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
                end: 4,
            }),
            repeat: -1,
            frameRate: 12,
        });

        //idle Push
        this.scene.anims.create({
            key: "idle_push",
            frames: this.scene.anims.generateFrameNames("player", {
                prefix: "sbunny_push_idle_",
                start: 1,
                end: 5,
            }),
            repeat: -1,
            frameRate: 6,
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

        //physics
        //slows player down 
        this.setDragX(2000);
        //world bounds
        this.setCollideWorldBounds(true);
        //max velocity
        this.setMaxVelocity(200, 650);
    }

    update(time, delta) {
        super.update();

        if(this.control) {
            //restart
            if (Phaser.Input.Keyboard.JustDown(this.restart)) {
                this.scene.scene.start(game.settings.currentLevel);

                //remove music via level
                switch(game.settings.currentLevel) {
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
                //start the pause scene
                game.scene.start("pause");
                //move the current level down
                game.scene.moveDown(game.settings.currentLevel);
                game.scene.pause(game.settings.currentLevel);
            }

            if(!this.camera) {

                //left
                if(this.cursors.left.isDown){
                    //flip the sprite
                    this.setFlipX(false);
                    //move left
                    this.setAccelerationX(-700);

                    //allows for almost immediate direction change
                    if(this.body.velocity.x >= 0)
                        this.body.velocity.x = 0;

                    //play animation
                    if(!this.holding)
                        this.anims.play("walk", true);
                    else
                        this.anims.play("push", true);

                    //walking sound
                    if(this.walking && this.body.blocked.down) {
                        this.scene.sound.play("bunwalk", {loop: true});
                        this.walking = false;
                    }
                } else if (this.cursors.right.isDown) {
                    //flip the sprite right
                    this.setFlipX(true);
                    //move right
                    this.setAccelerationX(700);

                    //allows for almost immediate direction change
                    if(this.body.velocity.x <= 0)
                        this.body.velocity.x = 0;

                    //play animation
                    if(!this.holding)
                        this.anims.play("walk", true);
                    else
                        this.anims.play("push", true);

                    //play walking sound
                    if(this.walking && this.body.blocked.down) {
                        this.scene.sound.play("bunwalk", {loop: true});
                        this.walking = false;
                    }
                } else {
                    //dont allow the player to glide left/right
                    this.setAccelerationX(0);

                    //play animation
                    if(!this.holding)
                        this.anims.play("idle", true);
                    else {
                        this.anims.play("idle_push", true);
                    }

                    //reset the walking sound
                    this.walking = true;
                    this.scene.sound.removeByKey("bunwalk");
                }

                //jumping
                if((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) 
                && this.canJump){
                    //set can jump to false to allow for only one jump
                    this.canJump = false;

                    //bubble jump (reduced height)
                    if(this.holding) {
                        this.setVelocityY(-570);
                    } else { //regular jump
                        this.setVelocityY(-700);
                    }

                    this.setAccelerationY(300);
                }

                //camera mode
                if (Phaser.Input.Keyboard.JustDown(this.zoom)) {
                    this.cameraMode();
                }
            } else {
                //update the camera position
                this.camControl.update(delta);

                //exit camera mode
                if (Phaser.Input.Keyboard.JustDown(this.zoom)) {
                    //set camera mode to false
                    this.camera = false;

                    //follow the player and reset the size
                    this.scene.cameras.main.startFollow(this, true, 0.1, 0.1);
                    this.scene.cameras.main.setSize(640, 360);
                    this.scene.cameras.main.setZoom(1);

                    //if there is a scroll image in the top right, replace it
                    if(this.scene.scrollCountImage != null) {
                        this.scene.scrollCountImage.alpha = 1;
                        this.scene.scrollCount.alpha = 1;
                    }
                }
            }

            //play jumping or falling animation
            if(this.body.velocity.y < 0) {
                //if you are not holding the bubble, play the regular jump animation
                if(!this.holding)
                    this.anims.play("jump", true);
                
                //set can jump to false
                this.canJump = false;
                //reset the walking sound
                this.walking = true;
                this.scene.sound.removeByKey("bunwalk");
            } else if (this.body.velocity.y > 0) {

                //max falling velocity
                if(this.body.velocity.y >= 400) {
                    this.setVelocityY(400);
                }

                //if not holding the bubble, regular falling animation
                if(!this.holding)
                    this.anims.play("fall", true);

                //set can jump to false
                this.canJump = false;
                //reset falling sound
                this.fallingSound = true;
                //reset the walking sound
                this.walking = true;
                this.scene.sound.removeByKey("bunwalk");
            }

            //landing sound
            if(this.body.blocked.down) {
                if(this.fallingSound) {
                    this.scene.sound.play("playerLand", {volume: 0.1});
                    this.fallingSound = false;
                    this.canJump = true;
                }
            }

            //if touching nothing
            if(this.body.touching.none) {
                this.holding = false;
            }
        }
    }

    bubbleCollision(bunny, bubble) {
        //if you press the button to grab the bubble
        if (Phaser.Input.Keyboard.JustDown(this.grab)) {
            //grab the bubble if not holding, if holding, let go of bubble
            if (this.holding) {
                this.holding = false;
            } else {
                this.holding = true;
            }
        }

        //if you are already holding it
        if(this.holding) {
            //remove bubble's gravity
            bubble.body.setAllowGravity(false);
            bubble.setAccelerationY(0);
            
            //move the bubble to the player's hand
            bubble.y = bunny.y;

            //if not on the wall. 
            if(!bubble.body.onWall()) {
                //flip the bubble's position to be left or right, depending on player's flip
                if(bunny.flipX){
                    bubble.x = bunny.x + bunny.width/2 + 4;
                } else {
                    bubble.x = bunny.x - bunny.width/2 - 4;
                }
            }

            //give the bubble velocity to be thrown
            bubble.body.setVelocityX(bunny.body.velocity.x);
            bubble.body.setVelocityY(bunny.body.velocity.y);
        } else {
            //readd the bubble's gravity
            bubble.body.setAllowGravity(true);
        }
    }

    cameraMode() {

        //inside camera mode
        this.camera = true;

        //set the player's body to stuff
        this.body.setAccelerationX(0);
        this.body.setVelocityX(0);

        //https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FixedController.js Nathan Altice
        let controlConfig = {
            camera: this.scene.cameras.main,      // which camera?
            left: this.cursors.left,             // define keys...
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: { x: 0.4, y: 0.4}         // set speed of camera (keep values low)
        }

        //stop following the player and zoom out
        this.scene.cameras.main.stopFollow();
        this.scene.cameras.main.setZoom(0.75);

        //if the scroll image exists, make it transparent
        if(this.scene.scrollCountImage != null) {
            this.scene.scrollCountImage.alpha = 0;
            this.scene.scrollCount.alpha = 0;
        }

        //give camera controls to arrow keys
        this.camControl = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    }
}