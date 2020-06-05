class Geyser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        if (type == "a") {
            //shorter geyser
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

            //play animation
            this.anims.play("gAIdle");

        } else { //type == b
            //taller geyser
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
            //play animation
            this.anims.play("gBIdle");
        }

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //set to immovable and no gravity
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        //properties
        this.scene = scene;

        //geyser music
        this.music = this.scene.sound.add("geyser", {
            loop: true,
            volume: 0.2,
        });

        //play music
        this.music.play();
    }

    update() {
        //calculate the distance between the player and the geyser
        this.distance = Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.x, this.y);

        //equation to change the distance into a value between 0 and 1
        //0.2 is the max volume
        //0.0007 is the scale by which a player will be around 300 pixels away (one screen's worth), and the value will be around 0.0001;
        this.waterVolume = this.distance*-0.0007+0.2;

        //if the player is offscreen, set the volume to 0
        if(this.waterVolume <= 0) {
            this.waterVolume = 0;
        }
        
        //change the volume
        this.music.volume = this.waterVolume;
    }
}