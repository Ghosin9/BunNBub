let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 360,
    pixelArt: true,
    zoom: 2,

    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 1500,
            },
        }
    },

    scene: [Load, Menu, Tutorial, Level1]
};

let game = new Phaser.Game(config);

game.settings = {
    gameOver: false,
}