var GameState = function(game) {
};

GameState.prototype.preload = function() {
  // loads sprite for ship
  this.game.load.spritesheet('ship', 'ship.png', 32, 32);
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x333333;

  this.ROTATION_SPEED = 180;
  this.ACCELERATION = 200;
  this.MAX_SPEED = 250;

  // adds ship to stage
  this.ship = this.game.add.sprite(this.game.width / 2, this.game.height /2, 'ship');
  this.ship.anchor.setTo(0.5, 0.5);
  this.ship.angle = -90;

  // enable physics on ship
  this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

  // set max velocity
  this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);

  // capture events to prevent default browser action
  this.game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN
  ]);
};

// where the magic happens
GameState.prototype.update = function() {
  // keeps the ship on screen
  if(this.ship.x > this.game.width) this.ship.x = 0;
  if(this.ship.x < 0) this.ship.x = this.game.width;
  if(this.ship.y > this.game.height) this.ship.y = 0;
  if(this.ship.y < 0) this.ship.y = this.game.height;

  if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.ship.body.angularVelocity = -this.ROTATION_SPEED;
  } else if(this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.ship.body.angularVelocity = this.ROTATION_SPEED;
  } else{
    this.ship.body.angularVelocity = 0;
  }

  if(this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * this.ACCELERATION;
    this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * this.ACCELERATION;

    this.ship.frame = 1;
  } else {
    this.ship.body.acceleration.setTo(0, 0);

    this.ship.frame = 0;
  }
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);