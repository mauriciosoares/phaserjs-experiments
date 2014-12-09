var GameState = function(game) {

};

GameState.prototype.preload = function() {
  this.game.load.image('player', '');
  this.game.load.image('flag', '');
};

// setup
GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x4488cc;

  // creates flag
  var flag = this.game.add.sprite(50, 50, 'flag');
  this.game.add.tween(flag)
    .to({ x: this.game.width - 50, y: 50 }, 2000, Phaser.Easing.Sinusoidal.InOut)
    .to({ x: this.game.width - 50, y: this.game.height - 50 }, 1200, Phaser.Easing.Sinusoidal.InOut)
    .to({ x: 50, y: this.game.height - 50 }, 2000, Phaser.Easing.Sinusoidal.InOut)
    .to({ x: 50, y: 50 }, 1200, Phaser.Easing.Sinusoidal.InOut)
    .start()
    .loop();


  // create a follower
  var NUMBER_OF_FOLLOWERS = 10;
  for(var i = 0; i < NUMBER_OF_FOLLOWERS; i += 1) {
    var f = this.game.add.existing(
      new Follower(this.game, this.game.width / 2 + i * 32, this.game.height / 2, f || this.game.input)
    );

    var f2 = this.game.add.existing(
      new Follower(this.game, this.game.width / 2 + i * 32, this.game.height / 2, f2 || flag)
    );
  }


  // simulate pointer click/tap to center
  this.game.input.x = this.game.width / 2;
  this.game.input.y = this.game.height / 2;
};

var Follower = function(game, x, y, target) {
  Phaser.Sprite.call(this, game, x, y, 'player');

  // save the target that this follower will follow
  // the target is any object with x and y properties
  this.target = target;

  // set the pivot point for this sprite to the center
  this.anchor.setTo(0.5, 0.5);

  // enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);

  this.history = [];

  // DEFINE CONSTATNS
  this.HISTORY_LENGTH = 5;
  this.MAX_SPEED = 250;
  this.MIN_DISTANCE = 32; // pixels
};

// followers are a type of Phaser.Sprite
Follower.prototype = Object.create(Phaser.Sprite.prototype);
Follower.prototype.constructor = Follower;

Follower.prototype.update = function() {
  var t = {};
  var targetMoving = false;

  if(this.target.history && this.target.history.length) {
    // target has history, so go towards that
    t = this.target.history[0];
    if(this.target.body.velocity.x || this.target.body.velocity.y) targetMoving = true;
  } else {
    // doesnt have history, just follow x and y
    t.x = this.target.x;
    t.y = this.target.y;

    var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
    if(distance > this.MIN_DISTANCE) targetMoving = true;
  }


  if(targetMoving) {
    // add current position to end of history array
    this.history.push({ x: this.x, y: this.y });

    if(this.history.length > this.HISTORY_LENGTH) this.history.shift();

    // Calculate the angle to the target
    var rotation = this.game.math.angleBetween(this.x, this.y, t.x, t.y);

    // Calculate velocity vector based on rotation and this.MAX_SPEED
    this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
    this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;

  } else {
    this.body.velocity.setTo(0, 0);
  }
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
