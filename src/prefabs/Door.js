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
            //remove music
            this.scene.sound.stopAll();
            
            this.scene.scene.start("transition");
            this.scene.scene.stop(this.currentLevel);

        });
    }

    doorCollision(player, door) {
        if(player.holding && this.transition) {
            this.scene.cameras.main.fadeOut(1750);
            this.scene.sound.play("doorSound");
            this.transition = false;
        }
    }
}