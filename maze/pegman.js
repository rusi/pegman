
'use strict';

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
Pegman.LOOK_WIDTH = 100;
Pegman.LOOK_HEIGHT = 100;

Pegman.startPos = {x: 0, y: 0};
Pegman.startDirection = DirectionType.EAST;

Pegman.posX = 0;
Pegman.posY = 0;
Pegman.direction = DirectionType.EAST;

Pegman.pegmanActions = [];

Pegman.pegmanSprite = null;
Pegman.lookSprite = null;
Pegman.anim = null;
Pegman.tween = null;

Pegman.preload = function() {
	game.load.spritesheet('pegman', './assets/pegman.png', Pegman.PEGMAN_WIDTH, Pegman.PEGMAN_HEIGHT-1);
	game.load.spritesheet('look', './assets/lookThinner.png', Pegman.LOOK_WIDTH, Pegman.LOOK_HEIGHT);
}

Pegman.create = function() {
	var fps = 7;
	if (this.pegmanSprite === null) {
		this.pegmanSprite = game.add.sprite(0, 0, 'pegman');
		this.pegmanSprite.kill();
		this.pegmanSprite.anchor.setTo(0, 0.15);
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

		this.pegmanSprite.animations.add('FINISH', [20, 18, 20, 16, 20, 16, 20, 18, 20], fps, /*loop*/false);
	}
	if (this.lookSprite === null) {
		this.lookSprite = game.add.sprite(0, 0, 'look', 3);
		this.lookSprite.kill();
		this.lookSprite.anchor.setTo(0, 0.5);
		this.lookSprite.animations.add('LOOK', [0, 1, 2, 3, 4, 5], fps, /*loop*/false);
	}
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

	this.pegmanActions = [];
	this.resetPos();
}

Pegman.resetPos = function() {
	this.posX = this.startPos.x;
	this.posY = this.startPos.y;
	this.direction = this.startDirection;
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

Pegman.animateFailMoveBy = function(stepX, stepY) {
	var x = this.posX * Maze.SQUARE_SIZE;
	var y = this.posY * Maze.SQUARE_SIZE;
	this.tween = game.add.tween(this.pegmanSprite);
	this.tween
		.to({ x: x + stepX * 10, y: y + stepY * 10 }, 200, Phaser.Easing.Linear.None)
		.to({ x: x, y: y }, 10, Phaser.Easing.Linear.None)
		.to({ x: x + stepX * 10, y: y + stepY * 10 }, 200, Phaser.Easing.Linear.None)
		.to({ x: x, y: y }, 10, Phaser.Easing.Linear.None)
		.to({ x: x + stepX * 10, y: y + stepY * 10 }, 200, Phaser.Easing.Linear.None)
		.to({ x: x, y: y }, 10, Phaser.Easing.Linear.None)
		.start();
}

Pegman.animateTurnTo = function(d) {
	//console.log(d);
	this.anim = this.pegmanSprite.animations.play(d);
	this.anim.onComplete.addOnce(function() {
		this.playNextAction();
	}, this);
}

Pegman.animateFinish = function() {
	this.anim = this.pegmanSprite.animations.play("FINISH");
	this.anim.onComplete.addOnce(function() {
		this.pegmanSprite.animations.play(directionToString(this.direction)).onComplete.addOnce(function(){
			BlocklyUtils.congratulations();
		});
	}, this);
}

Pegman.animateLook = function(rotationDeg) {
	this.lookSprite.reset(this.posX * Maze.SQUARE_SIZE + Pegman.PEGMAN_WIDTH/2, this.posY * Maze.SQUARE_SIZE + Pegman.PEGMAN_HEIGHT/2);
	this.lookSprite.angle = this.direction * 90 - 90 + rotationDeg;
	this.anim = this.lookSprite.animations.play("LOOK");
	this.anim.onComplete.addOnce(function() {
		this.lookSprite.kill();
		this.playNextAction();
	}, this);
}

Pegman.play = function() {
	this.resetPos();
	this.playNextAction();
}

Pegman.nextAction = function(action) {
	this.pegmanActions.push(action);
}

Pegman.playNextAction = function() {
	if (this.pegmanActions.length <= 0) {
		BlocklyUtils.highlight(null);
		return;
	}

	if (this.tween) {
		this.tween = null;
	}
	if (this.anim) {
		this.anim = null;
	}

	var action = this.pegmanActions.shift();
	// console.log(action);
	BlocklyUtils.highlight(action.blockId);
	if (action.command !== null) {
		switch (action.command) {
			case "forward":
				var step = getStepInDirection[directionToString(this.direction)];
				this.animateMoveTo(this.posX + step[0], this.posY + step[1]);
				break;
			case "fail_forward":
				var step = getStepInDirection[directionToString(this.direction)];
				this.animateFailMoveBy(step[0], step[1]);
				break;
			case "left":
				this.animateTurnTo(this.turnTo(constrain(this.direction - 1, 4)));
				break;
			case "right":
				this.animateTurnTo(this.turnTo(constrain(this.direction + 1, 4)));
				break;
			case "finish":
				this.animateFinish();
				break;
			case "lookForward":
				this.animateLook(0);
				break;
			case "lookLeft":
				this.animateLook(-90);
				break;
			case "lookRight":
				this.animateLook(90);
				break;
			default:
				console.log("Missing: " + action.command);
				window.setTimeout(function () {
					Pegman.playNextAction();
				}, 500);
				break;
		}
	} else {
		window.setTimeout(function () {
			Pegman.playNextAction();
		}, 500);
	}
}

Pegman.turnTo = function(newDirection) {
	var d = directionToString(this.direction);
	this.direction = newDirection;
	d += "_" + directionToString(this.direction);
	return d;
}

Pegman.moveForward = function(id) {
	var step = getStepInDirection[directionToString(this.direction)];
	var newPos = { posX: this.posX + step[0], posY: this.posY + step[1] };

	if (!Maze.isPath(newPos.posX, newPos.posY)) {
		this.nextAction({ command: "fail_forward", blockId: id });
		throw false; // failed; no path
	}

	this.posX = newPos.posX;
	this.posY = newPos.posY;
	this.nextAction({command: "forward", blockId: id});

	if (Maze.isFinish(newPos.posX, newPos.posY)){
		this.nextAction({command: "finish", blockId: id});
		throw true;  // success; reached the finish line!
	}
}
Pegman.turnLeft = function(id) {
	this.turnTo(constrain(this.direction - 1, 4));
	Pegman.nextAction({command: "left", blockId: id});
}
Pegman.turnRight = function(id) {
	this.turnTo(constrain(this.direction + 1, 4));
	Pegman.nextAction({command: "right", blockId: id});
}

Pegman.isPath = function(direction) {
	var step = getStepInDirection[directionToString(direction)];

	return Maze.isPath(this.posX + step[0], this.posY + step[1]);
}

Pegman.isPathForward = function(id) {
	Pegman.nextAction({command: "lookForward", blockId: id});
	return this.isPath(this.direction);
}
Pegman.isPathLeft = function(id) {
	Pegman.nextAction({command: "lookLeft", blockId: id});
	return this.isPath(constrain(this.direction - 1, 4));
}
Pegman.isPathRight = function(id) {
	Pegman.nextAction({command: "lookRight", blockId: id});
	return this.isPath(constrain(this.direction + 1, 4));
}