class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        //gameplay assets
        this.load.path = "assets/";
        //player
        this.load.atlas("player", "bunny.png", "bunny.json");
        //bubble
        this.load.atlas("bubble", "bubble.png", "bubble.json");
        //bubble pop
        this.load.atlas("bubblepop", "bubble_pop.png", "bubble_pop.json");
        //dialogue box
        this.load.image("dialogue", "dialogue.png");
        //jellyfish
        this.load.atlas("jelly", "jellyfish.png", "jellyfish.json");
        //door
        this.load.atlas("door", "door.png", "door.json");
        //scroll
        this.load.image("scroll", "scroll.png");
        //geyser
        this.load.atlas("geyser_a", "geyser_a.png", "geyser_a.json");
        this.load.atlas("geyser_b", "geyser_b.png", "geyser_b.json");
        //turtle
        this.load.atlas("turtle", "turtle.png", "turtle.json");

        //ui assets
        this.load.path = "assets/ui/";
        //main menu
        this.load.image("mainMenu", "menu.png");
        //pause
        this.load.image("pause", "pause.png");
        //cutscene
        this.load.image("cutscene1", "boat.png");
        this.load.image("cutscene2", "sleep.png");
        this.load.image("cutscene3", "high1.png");
        this.load.image("cutscene4", "high2.png");

        //sound assets
        this.load.path = "assets/sound/";
        //background music
        this.load.audio("music", "bgmusic.wav");
        //damage sounds
        this.load.audio("d1", "damage1.wav");
        this.load.audio("d2", "damage2.wav");
        //landing audio
        this.load.audio("bubbleLand", "landing.wav");
        this.load.audio("playerLand", "landing2.wav");
        //bubble noises
        this.load.audio("pop", "pop.wav");
        this.load.audio("push", "push.wav");
    }

    create() {
        this.scene.start("menu");
    }
}