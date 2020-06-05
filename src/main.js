// plugins used
// PHASER we love phaser https://photonstorm.github.io/phaser3-docs/
// Animated tiles library used from Richard Davey's https://github.com/nkholski/phaser-animated-tiles
// -Used the the beginning of each level to animate tiles in Tiled
// Nathan Altice, Professors at UCSC https://github.com/nathanaltice?tab=repositories 
// -Specific uses of Nathan Altice's code are cited more specifically at those instances
// Loading bar code https://www.patchesoft.com/phaser-3-loading-screen 

// Brought to you by Team Windows XP Error Sound, Mia Kennedy, Vivian Pham, Ly Phung
// 👉👈 pls explore the map 👉👈 we put a lot of work into it 👉👈 no speed runs allowed 👉👈
// Last Updated: 6/4/20

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