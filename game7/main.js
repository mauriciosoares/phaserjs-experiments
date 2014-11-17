var GameState = function(game) {

};

GameState.prototype.preload = function() {
  this.game.load.image('player', '');
};

// setup
GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x4488cc;

  // create a follower
  var NUMBER_OF_FOLLOWERS = 10;
  for(var i = 0; i < NUMBER_OF_FOLLOWERS; i += 1) {
    var f = this.game.add.existing(
      new Follower(this.game, this.game.width / 2, this.game.height / 2, f || this.game.input)
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
  var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

  if(distance > this.MIN_DISTANCE) {
    var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

    this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
    this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
  } else {
    this.body.velocity.setTo(0, 0);
  }
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
