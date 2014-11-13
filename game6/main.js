var GameState = function(game) {
};

GameState.prototype.preload = function() {
  // loads sprite for ship
  this.game.load.spritesheet('ship', 'ship.png', 32, 32);
  this.game.load.image('ground', 'ground.png');
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x333333;

  this.ROTATION_SPEED = 180;
  this.ACCELERATION = 200;
  this.MAX_SPEED = 250;
  this.DRAG = 50;
  this.GRAVITY = 100;

  // adds ship to stage
  this.ship = this.game.add.sprite(this.game.width / 2, this.game.height /2, 'ship');
  this.ship.anchor.setTo(0.5, 0.5);
  this.ship.angle = -90;

  // enable physics on ship
  this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

  // set max velocity
  this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);

  // sets drag to ship, slows down when not accelerating
  this.ship.body.drag.setTo(this.DRAG, this.DRAG);

  this.physics.arcade.gravity.y = this.GRAVITY;

  // make ship bounce
  this.ship.body.bounce.setTo(0.25, 0.25);

  // capture events to prevent default browser action
  this.game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN
  ]);

  this.ground = this.game.add.group();
  for(var x = 0; x < this.game.width; x += 32) {
    var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
    this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
    groundBlock.body.immovable = true;
    groundBlock.body.allowGravity = false;
    this.ground.add(groundBlock);
  }
};

// where the magic happens
GameState.prototype.update = function() {
  // keeps the ship on screen
  if(this.ship.x > this.game.width) this.ship.x = 0;
  if(this.ship.x < 0) this.ship.x = this.game.width;

  // collide shipe with ground
  this.game.physics.arcade.collide(this.ship, this.ground);

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