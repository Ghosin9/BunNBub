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
        //scroll counter
        this.load.image("scrollCounter", "scroll_count_a.png");
        //geyser
        this.load.atlas("geyser_a", "geyser_a.png", "geyser_a.json");
        this.load.atlas("geyser_b", "geyser_b.png", "geyser_b.json");
        //turtle
        this.load.atlas("turtle", "turtle.png", "turtle.json");
        //guppy
        this.load.atlas("guppy", "guppy.png", "guppy.json");

        //ui assets
        this.load.path = "assets/ui/";
        //main menu
        this.load.image("mainMenu", "menu.png");
        //pause
        this.load.image("pauseImage", "pause.png");
        //credits
        this.load.image("creditsImage", "credits.png");
        //cutscene
        this.load.image("cutscene1", "boat.png");
        this.load.image("cutscene2", "sleep.png");
        this.load.image("cutscene3", "high1.png");
        this.load.image("cutscene4", "high2.png");

        //sound assets
        this.load.path = "assets/sound/";
        //background music
        //tutorial
        this.load.audio("bgtut", "bgtut.wav");
        //lvl1
        this.load.audio("bg1", "bg1.wav");
        //lvl2
        this.load.audio("bg2", "bg2.wav");
        //lvl3
        this.load.audio("bg3", "bg3.wav");
        //lvl4
        this.load.audio("bg4", "bg4.wav");
        //lvl5
        this.load.audio("bgend", "bgend.wav");
        //walking
        this.load.audio("bunwalk", "bunwalk.wav");
        //door
        this.load.audio("doorSound", "door.wav");
        //geyser
        this.load.audio("geyser", "geyser.wav");
        //jelly talk
        this.load.audio("jellytalk", "jellytalk.wav");
        //landing audio
        this.load.audio("bubbleLand", "landing.wav");
        this.load.audio("playerLand", "landing2.wav");
        //menu bg music
        this.load.audio("menubg", "menubg.wav");
        //menu select
        this.load.audio("menuSelect", "menuSelect.wav");
        //bubble noises
        this.load.audio("pop", "pop.wav");
        this.load.audio("push", "push.wav");
        //scroll
        this.load.audio("scroll1", "scroll1.wav");
        this.load.audio("scroll2", "scroll2.wav");
    }

    create() {
        this.scene.start("tutorial");
    }
}