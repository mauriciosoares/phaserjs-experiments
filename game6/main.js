var GameState = function(game) {
};

GameState.prototype.preload = function() {
  // loads sprite for ship
  this.game.load.spritesheet('ship', 'ship.png', 32, 32);

  this.game.load.spritesheet('explosion', 'explosion.png', 128, 128);
  this.game.load.audio('explosion', 'explosion.wav');

  this.game.load.image('ground', 'ground.png');
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x333333;
  this.explosion = this.game.add.audio('explosion');

  this.ROTATION_SPEED = 180;
  this.ACCELERATION = 200;
  this.MAX_SPEED = 400;
  this.DRAG = 50;
  this.GRAVITY = 100;

  // adds ship to stage
  this.ship = this.game.add.sprite(32, 32, 'ship');
  this.ship.anchor.setTo(0.5, 0.5);

  // enable physics on ship
  this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

  // set max velocity
  this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);

  // sets drag to ship, slows down when not accelerating
  this.ship.body.drag.setTo(this.DRAG, this.DRAG);

  this.resetShip();

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

  // create a group for explosions
  this.explosionGroup = this.game.add.group();
};

// where the magic happens
GameState.prototype.update = function() {
  // keeps the ship on screen
  if(this.ship.x > this.game.width) this.ship.x = 0;
  if(this.ship.x < 0) this.ship.x = this.game.width;

  // collide shipe with ground
  this.game.physics.arcade.collide(this.ship, this.ground, function(ship, ground) {
    // checks velocity of ship
    if(Math.abs(ship.body.velocity.y) > 20 || Math.abs(ship.body.velocity.x) > 30) {
      this.getExplosion(ship.x, ship.y);
      this.explosion.play();
      this.resetShip();
    } else {
      ship.body.velocity.setTo(0, 0);
      ship.angle = -90;
    }
  }, null, this);

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

// try to use an existing explosion from group
// if doesn't exist, creates a new one
GameState.prototype.getExplosion = function(x, y) {
  var explosion = this.explosionGroup.getFirstDead();

  if(!explosion) {

    explosion = this.game.add.sprite(0, 0, 'explosion');
    explosion.anchor.setTo(0.5, 0.5);

    // adds animation for explosion
    var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
    animation.killOnComplete = true;

    this.explosionGroup.add(explosion);
  }

  explosion.revive();

  // moves to the bullet coordinate
  explosion.x = x;
  explosion.y = y;

  // rotates explosion for a variety
  explosion.angle = this.game.rnd.integerInRange(0, 360);

  explosion.animations.play('boom');
};

GameState.prototype.resetShip = function() {
  this.ship.x = 32;
  this.ship.y = 32;

  this.ship.body.acceleration.setTo(0, 0);

  this.ship.angle = this.game.rnd.integerInRange(-180, 180);
  this.ship.body.velocity.setTo(this.game.rnd.integerInRange(100, 400), 0);
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);