
'use strict';

var Maze = Maze || {};

var blocksA = [
	{ b:"pegman_moveForward" },
	{ b:"pegman_turn", f:["DIR", "turnLeft"] },
	{ b:"pegman_turn", f:["DIR", "turnRight"] }
];

var blocksB = _.union(blocksA, [{ b:"block_forever" }]);

Maze.levels = [
{
	caption: "Basic functions 1",
	map: // Level 1.
		 [[0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 2, 1, 3, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: Infinity, // unlimited
	blocks: blocksA,
},
{
	caption: "Basic functions 2",
	map: // Level 2.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 1, 3, 0, 0, 0],
		  [0, 0, 2, 1, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: Infinity, // unlimited
	blocks: blocksA,
},
{
	caption: "Loops 1 (is it possible?)",
	map: // Level 3.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 2, 1, 1, 1, 1, 3, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 2,
	blocks: blocksA,
},
{
	caption: "Loops 2",
	map: // Level 3. (same, but has an extra block)
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 2, 1, 1, 1, 1, 3, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 2,
	blocks: blocksB,
}

];