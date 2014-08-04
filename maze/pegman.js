
// 'use strict';

/**
 * Constants for cardinal directions.  Subsequent code assumes these are
 * in the range 0..3 and that opposites have an absolute difference of 2.
 * @enum {number}
 */
var DirectionType = {
	NORTH: 0,
	EAST: 1,
	SOUTH: 2,
	WEST: 3
};
var directionToString = function(direction)
{
	switch (direction)
	{
		case DirectionType.EAST:
		return "EAST";
		case DirectionType.WEST:
		return "WEST";
		case DirectionType.SOUTH:
		return "SOUTH";
		case DirectionType.NORTH:
		return "NORTH";
		default:
		return "";
	}
};
var getStepInDirection = {
	EAST:  [ 1,  0],
	WEST:  [-1,  0],
	SOUTH: [ 0,  1],
	NORTH: [ 0, -1],
};

var Pegman = Pegman || {};

Pegman.PEGMAN_HEIGHT = 52;
Pegman.PEGMAN_WIDTH = 49;

Pegman.startPos = {x: 0, y: 0};
Pegman.startDirection = DirectionType.EAST;

Pegman.pegmanSprite = null;
Pegman.posX = 0;
Pegman.posY = 0;

Pegman.direction = DirectionType.EAST;
Pegman.pegmanActions = [];
Pegman.pegmanSprite = null;
Pegman.anim = null;
Pegman.tween = null;

Pegman.preload = function() {
	game.load.spritesheet('pegman', './assets/pegman.png', Pegman.PEGMAN_WIDTH, Pegman.PEGMAN_HEIGHT-1);
}

Pegman.create = function() {
	if (this.pegmanSprite !== null)
		return;
	this.pegmanSprite = game.add.sprite(0, 0, 'pegman');
	this.pegmanSprite.kill();
	this.pegmanSprite.anchor.setTo(0, 0.15);
	var fps = 7;
	this.pegmanSprite.animations.add('NORTH', [0], fps, /*loop*/false);
	this.pegmanSprite.animations.add('EAST', [4], fps, /*loop*/false);
	this.pegmanSprite.animations.add('SOUTH', [8], fps, /*loop*/false);
	this.pegmanSprite.animations.add('WEST', [12], fps, /*loop*/false);
	this.pegmanSprite.animations.add('WEST_SOUTH', [12, 11, 10, 9, 8], fps, /*loop*/false);
	this.pegmanSprite.animations.add('SOUTH_WEST', [8, 9, 10, 11, 12], fps, /*loop*/false);
	this.pegmanSprite.animations.add('WEST_NORTH', [12, 13, 14, 15, 0], fps, /*loop*/false);
	this.pegmanSprite.animations.add('NORTH_WEST', [0, 15, 14, 13, 12], fps, /*loop*/false);
	this.pegmanSprite.animations.add('EAST_SOUTH', [4, 5, 6, 7, 8], fps, /*loop*/false);
	this.pegmanSprite.animations.add('SOUTH_EAST', [8, 7, 6, 5, 4], fps, /*loop*/false);
	this.pegmanSprite.animations.add('EAST_NORTH', [4, 3, 2, 1, 0], fps, /*loop*/false);
	this.pegmanSprite.animations.add('NORTH_EAST', [0, 1, 2, 3, 4], fps, /*loop*/false);
}

Pegman.init = function(startPos) {
	this.create();
	this.startPos = startPos;
	// this.startDirection = startDirection;
	this.reset();
}

Pegman.reset = function() {
	if (this.tween) {
		this.tween.stop();
	}
	if (this.anim) {
		this.anim.stop();
	}
	// reset
	this.tween = null;
	this.anim = null;

	this.posX = this.startPos.x;
	this.posY = this.startPos.y;
	this.direction = this.startDirection;
	this.pegmanActions = [];
	// post reset
	this.pegmanSprite.reset(this.posX * Maze.SQUARE_SIZE, this.posY * Maze.SQUARE_SIZE);
	this.pegmanSprite.animations.play(directionToString(this.direction));
}

Pegman.animateMoveTo = function(x, y) {
	this.posX = x;
	this.posY = y;

	this.tween = game.add.tween(this.pegmanSprite);
	this.tween.to({
			x: this.posX * Maze.SQUARE_SIZE,
			y: this.posY * Maze.SQUARE_SIZE,
		}, 1000, Phaser.Easing.Exponential.InOut);
	this.tween.onComplete.addOnce(function() {
		this.playNextAction();
	}, this);
	this.tween.start();
}

Pegman.animateTurnTo = function(d) {
	//console.log(d);
	this.anim = this.pegmanSprite.animations.play(d);
	this.anim.onComplete.addOnce(function() {
		this.playNextAction();
	}, this);
}

