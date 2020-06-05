class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "door", "door_1").setOrigin(0, 1);

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //make immovable and unaffected by gravity
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        //properties
        this.scene = scene;
        this.transition = true;

        //add method for what to do after the camera fades to next level
        this.scene.cameras.main.once("camerafadeoutcomplete", () => { 
            //remove music
            this.scene.sound.removeByKey("bunwalk");

            //start the level transition, stop the current level
            this.scene.scene.start("transition");
            this.scene.scene.stop(game.settings.currentLevel);
            this.scene.scene.moveUp("pause");

        });
    }

    doorCollision(player, door) {
        //play the sound and fade out the camera to transition to next level
        if(player.holding && this.transition) {
            this.scene.cameras.main.fadeOut(1750);
            this.scene.sound.play("doorSound");
            this.transition = false;
        }
    }
}