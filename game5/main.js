var GameState = function() {

};

GameState.prototype.preload = function() {
  this.game.load.image('bullet', 'bullet.png');
  this.game.load.image('ground', 'ground.png');

  this.game.load.spritesheet('explosion', 'explosion.png', 128, 128);

  this.game.load.audio('shot', 'shot.wav');
  this.game.load.audio('explosion', 'explosion.wav');
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x4488c;

  this.shot = this.game.add.audio('shot');
  this.explosion = this.game.add.audio('explosion');

  // define constantos
  this.SHOT_DELAY = 500; // miliseconds
  this.BULLET_SPEED = 800; // pixels/second
  this.NUMBER_OF_BULLETS = 10;
  this.GRAVITY = 980;

  // create an object representing our gun
  this.gun = this.game.add.sprite(50, this.game.height - 64, 'bullet');

  // set the pivot point to the center of the gun
  this.gun.anchor.setTo(0.5, 0.5);

  // create an object pool of bullets
  this.bulletPool = this.game.add.group();
  this.lastBulletShotAt = 0;

  for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
    var bullet = this.game.add.sprite(0, 0, 'bullet');
    this.bulletPool.add(bullet);

    // set its pivot to the center of the bullet
    bullet.anchor.setTo(0.5, 0.5);

    // enable physics on the bullet
    this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

    // set its initial state to "dead"
    bullet.kill();
  }

  // create a group for explosions
  this.explosionGroup = this.game.add.group();

  // turns gravity on
  game.physics.arcade.gravity.y = this.GRAVITY;

  // creates ground
  this.ground = this.game.add.group();
  for(var x = 0; x < this.game.width; x += 32) {
    // add blocks, enable physics, make them immovable
    var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
    this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
    groundBlock.body.immovable = true;
    groundBlock.body.allowGravity = false;
    this.ground.add(groundBlock);
  }

  // simulates click/tap when game begins
  this.game.input.activePointer.x = this.game.width / 2;
  this.game.input.activePointer.y = this.game.height / 2;
};


GameState.prototype.update = function() {
  if(this.game.input.activePointer.isDown) {
    this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);
    this.shootBullet();
  }

  // check if bullet collide ground
  // the null is a callback when collide...
  // if instead of null it was a function,
  // the collide callback will only happens if that
  // function returns true
  this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
    bullet.kill();
    this.explosion.play();
    this.getExplosion(bullet.x, bullet.y);
  }, function() { return true; }, this);

  // rotates all living bullets to their trajectory
  this.bulletPool.forEachAlive(function(bullet) {
    bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
  }, this);

  // aim the gun at the pointer
  // angleToPointer menas that gets the angle of this.gun compared
  // to the mouse pointer
  // if a second parameter is passed, than it becomes the pointer
  this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);
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

GameState.prototype.shootBullet = function() {
  // tests the delay between shots
  if(this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
  this.lastBulletShotAt = this.game.time.now;

  var bullet = this.bulletPool.getFirstDead();

  // if no bullets, dont shoot
  if(!bullet) return;

  bullet.revive();

  bullet.checkWorldBounds = true;
  bullet.outOfBoundsKill = true;

  bullet.reset(this.gun.x, this.gun.y);
  bullet.rotation = this.gun.rotation;

  // shoot
  bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
  bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
  this.shot.play();
}

var game = new Phaser.Game(1136, 640, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);