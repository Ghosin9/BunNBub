class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, currentLevel, nextLevel) {
        super(scene, x, y, "door", "door_1").setOrigin(0, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene = scene;
        this.nextLevel = nextLevel;
        this.currentLevel = currentLevel;

        this.transition = true;

        this.scene.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.scene.start(this.nextLevel);
            this.scene.scene.stop(this.currentLevel);
            
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
        });
    }

    doorCollision(player, door) {
        if(player.holding && this.transition) {
            this.scene.cameras.main.fadeOut(1000);
            this.scene.sound.play("doorSound");
            this.transition = false;
        }
    }
}