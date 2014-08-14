
'use strict';

var Maze = Maze || {};

Maze.MAX_LEVEL = Levels.length;
Maze.LEVEL = getNumberParamFromUrl('level', 1, Maze.MAX_LEVEL);

/**
 * The types of squares in the maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
Maze.SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3
};

// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/West/South/East squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
Maze.tile_SHAPES = {
  '10010': [4, 0],  // Dead ends
  '10001': [3, 3],
  '11000': [0, 1],
  '10100': [0, 2],
  '11010': [4, 1],  // Vertical
  '10101': [3, 2],  // Horizontal
  '10110': [0, 0],  // Elbows
  '10011': [2, 0],
  '11001': [4, 2],
  '11100': [2, 3],
  '11110': [1, 1],  // Junctions
  '10111': [1, 0],
  '11011': [2, 1],
  '11101': [1, 2],
  '11111': [2, 2],  // Cross
  'null0': [4, 3],  // Empty
  'null1': [3, 0],
  'null2': [3, 1],
  'null3': [0, 3],
  'null4': [1, 3]
};

Maze.level = Levels[Maze.LEVEL - 1];
Maze.map = Maze.level.map;

/**
 * Measure maze dimensions and set sizes.
 * ROWS: Number of tiles down.
 * COLS: Number of tiles across.
 * SQUARE_SIZE: Pixel height and width of each maze square (i.e. tile).
 */
Maze.ROWS = Maze.map.length;
Maze.COLS = Maze.map[0].length;
Maze.SQUARE_SIZE = 50;

Maze.MAZE_WIDTH = Maze.SQUARE_SIZE * Maze.COLS;
Maze.MAZE_HEIGHT = Maze.SQUARE_SIZE * Maze.ROWS;
Maze.PATH_WIDTH = Maze.SQUARE_SIZE / 3;

Maze.START = {};
Maze.FINISH = {};

Maze.SKIN = {
	tiles: './assets/tiles_pegman.png',
	marker: './assets/marker.png',
};

Maze.preload = function(){
	game.load.spritesheet('tiles', this.SKIN.tiles, Maze.SQUARE_SIZE, Maze.SQUARE_SIZE);
	game.load.image('marker', this.SKIN.marker);
}

Maze.init = function() {
	this.draw();

	this.marker = game.add.sprite(Maze.FINISH.x * Maze.SQUARE_SIZE, Maze.FINISH.y * Maze.SQUARE_SIZE, 'marker');
	this.marker.anchor.setTo(-0.75, 0.1);
}

Maze.isPath = function(x, y) {
	var square = Maze.map[y][x];
	return square !== Maze.SquareType.WALL && square !== undefined;
}

Maze.isFinish = function(x, y) {
	var square = Maze.map[y][x];
	return square === Maze.SquareType.FINISH && square !== undefined;
}

// Return a value of '0' if the specified square is wall or out of bounds,
// '1' otherwise (empty, start, finish).
Maze.normalize = function(x, y) {
	if (x < 0 || x >= Maze.COLS || y < 0 || y >= Maze.ROWS) {
		return '0';
	}
	return (Maze.map[y][x] == Maze.SquareType.WALL) ? '0' : '1';
};

Maze.drawTileAt = function(tileId, x, y)
{
	var coords = Maze.tile_SHAPES[tileId];
	var tileIndex = coords[1] * 5 + coords[0];
	game.add.sprite(x * Maze.SQUARE_SIZE, y * Maze.SQUARE_SIZE, 'tiles', tileIndex);
}

Maze.draw = function() {
	for (var y = 0; y < Maze.ROWS; y++)
	{
		for (var x = 0; x < Maze.COLS; x++)
		{
			// Compute the tile index.
			var tileId = this.normalize(x, y) +
				this.normalize(x, y - 1) +  // North.
				this.normalize(x + 1, y) +  // West.
				this.normalize(x, y + 1) +  // South.
				this.normalize(x - 1, y);   // East.
			// Draw the tile.
			if (_.indexOf(_.keys(Maze.tile_SHAPES), tileId) < 0)
			{
				// Empty square.  Use null0 for large areas, with null1-4 for borders.
				// Add some randomness to avoid large empty spaces.
				if (tileId == '00000' && Math.random() > 0.3) {
					tileId = 'null0';
				} else {
					tileId = 'null' + Math.floor(1 + Math.random() * 4);
				}
			}
			// drawTileAt is a framework specific implementation
			this.drawTileAt(tileId, x, y);

			// also identify start and finish coordinates
			if (Maze.map[y][x] == Maze.SquareType.START) {
				Maze.START = {x: x, y: y};
			} else if (Maze.map[y][x] == Maze.SquareType.FINISH) {
				Maze.FINISH = {x: x, y: y};
			}
		}
	}
}