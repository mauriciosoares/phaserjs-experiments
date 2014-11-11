var GameState = function(game) {
};

// load images
GameState.prototype.preload = function() {
  this.game.load.image('player', 'player.png');
  this.game.load.image('ground', 'ground.png');
};

// setup
GameState.prototype.create = function() {
  // background
  this.game.stage.backgroundColor = 0x4488cc;

  // define movment constants
  this.MAX_SPEED = 500; // pixels/second
  this.ACCELERATION = 1500; // pixels/second
  this.DRAG = 1500; // pixels/second
  this.GRAVITY = 2600; // pixels/second
  this.JUMP_SPEED = -700; // pixels/second (negative y is up)

  // creates player sprite
  this.player = this.game.add.sprite(this.game.width / 2, this.game.height - 64, 'player');
  // Enable physics on player
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

  // makes player colllide with the world bondaries
  this.player.body.collideWorldBounds = true;

  // set player max movment speed
  this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); //x, y

  // add drag to player, slows down when not accelerating
  this.player.body.drag.setTo(this.DRAG, 0);

  // since we are jumping, we need gravity
  game.physics.arcade.gravity.y = this.GRAVITY;

  // flag for double jump
  this.canDoubleJump = true;

  // flag for tracking if player can adjust their jump height
  this.canVariableJump = true;

  // capture keys to prevent default action in browser
  this.game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN
  ]);

  // create some ground
  this.ground = this.game.add.group();
  for(var x = 0; x < this.game.width; x += 32) {
    // add the ground blocks, enable physcs, make immovable
    var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
    this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
    groundBlock.body.immovable = true;
    groundBlock.body.allowGravity = false;
    this.ground.add(groundBlock);
  }

  // show fps
  this.game.time.advancedTiming = true;
  this.fpsText = this.game.add.text(
    20, 20, '', {font: '16px Arial', fill: '#ffffff'}
  );
};

// update method called every frame
GameState.prototype.update = function() {
  if(this.game.time.fps !== 0) {
    this.fpsText.setText(this.game.time.fps + ' FPS');
  }

  // collide player with ground
  this.game.physics.arcade.collide(this.player, this.ground);

  if(this.leftInputIsActive()) {
    this.player.body.acceleration.x = -this.ACCELERATION;
  } else if (this.rightInputIsActive()) {
    this.player.body.acceleration.x = this.ACCELERATION;
  } else {
    this.player.body.acceleration.x = 0;
  }

  // set variable that is true when the player is touching the ground
  var onTheGround = this.player.body.touching.down;
  if(onTheGround) this.canDoubleJump = true;

  if(this.input.keyboard.justPressed(Phaser.Keyboard.UP, 5)) {
    this.canVariableJump = true;

    if(this.canDoubleJump || onTheGround) {
      if(!onTheGround) this.canDoubleJump = false;

      this.player.body.velocity.y = this.JUMP_SPEED;
    }
  }

  if(this.canVariableJump && this.input.keyboard.justPressed(Phaser.Keyboard.UP, 150)) {
    this.player.body.velocity.y = this.JUMP_SPEED;
  }

  if(!this.input.keyboard.justPressed(Phaser.Keyboard.UP, 150)) {
    this.canVariableJump = false;
  }
};

GameState.prototype.leftInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x < this.game.width / 2);

  return isActive;
};

GameState.prototype.rightInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width / 2);

  return isActive;
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'body', GameState);
// game.state.add('game', GameState, true);