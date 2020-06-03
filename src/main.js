let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 360,
    render: {
        pixelArt: true,
    },
    zoom: 2,

    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: "arcade",
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 1500,
            },
        }
    },

    scene: [Load, Cutscene, Menu, Credits, Pause, Tutorial, Transition, Level1, Level2, Level3, Level4, Level5, EndCutscene]
};

let game = new Phaser.Game(config);

game.settings = {
    gameOver: false,
    geyserSpeed: -500,
    currentLevel: "tutorial",
}