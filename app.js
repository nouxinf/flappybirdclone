
let config = {
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
};
function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
}
let game = new Phaser.Game(config);
function preload () {
    this.load.image("background", "assets/background.png");
    this.load.image("road", "assets/road.png");
    this.load.image("column", "assets/pipe-green.png");
    this.load.spritesheet("bird", "assets/bird.png", { frameWidth: 64, frameHeight: 96});
    this.load.image("column-top", "assets/pipe-green-top.png")
}
loadFont("Micro5-Regular", "fonts/Micro5-Regular.ttf");
let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
function create () {
    const background = this.add.image(0, 0, "background").setOrigin(0, 0);
    const roads = this.physics.add.staticGroup();
    const topColumns = this.physics.add.staticGroup({
        key: "column-top",
        repeat: 1,
        setXY: { x: 200, y: 0, stepX: 300 },
        angle: 0
    });
    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: { x: 350, y: 400, stepX: 300 }
    });
    const road = roads.create(400, 568, "road").setScale(2).refreshBody();
    bird = this.physics.add.sprite(0, 50, "bird").setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);
    messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { fontFamily: '"Micro 5", Times, serif', fontSize: "30px", color: "white", backgroundColor: "black" });
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);

}

function update () {
  if (cursors.up.isDown && !hasLanded && !hasBumped) {
    bird.setVelocityY(-160);
  }
  if (!isGameStarted) {
    bird.setVelocityY(-160);
  }
  if (!hasLanded || !hasBumped) {
    bird.body.velocity.x = 50;
  }
  
  if (hasLanded || hasBumped || !isGameStarted) {
    bird.body.velocity.x = 0;
  }
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    messageToPlayer.text = "Instructions: Press the up arrow to stay upright\nAnd don't hit the columns or ground";

  }
  if (hasLanded || hasBumped) {
    messageToPlayer.text = "Oh no! You crashed!";
  }
  if (bird.x > 750) {
    bird.setVelocityY(40);
    messageToPlayer.text = "Congrats! You won!"
  }
}