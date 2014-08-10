
'use strict';

var Maze = Maze || {};

var blocksA = [
	{ b:"pegman_moveForward" },
	{ b:"pegman_turn", f:["DIR", "turnLeft"] },
	{ b:"pegman_turn", f:["DIR", "turnRight"] }
];

var blocksB = _.union(blocksA, [{ b:"block_forever" }]);

var blocksC = _.union(blocksB, [{ b:"block_if" }]);

var blocksD = _.union(blocksC, [{ b:"block_ifElse" }]);

Maze.levels = [
{
	caption: "Basic functions 1",
	map: // Level 1.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 2, 1, 3, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
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
	caption: "Basic functions 3",
	map:
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 2, 1, 1, 0, 0, 0, 0],
		  [0, 0, 0, 1, 0, 0, 0, 0],
		  [0, 0, 0, 1, 1, 1, 1, 0],
		  [0, 0, 0, 0, 1, 0, 1, 0],
		  [0, 0, 0, 0, 1, 0, 1, 0],
		  [0, 0, 0, 0, 1, 1, 1, 3],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: Infinity, // unlimited
	blocks: blocksA,
},
{
	caption: "Loops 1 (is it possible?)",
	helpText: "Try the <a href='" + BlocklyUtils.nextLevelURL("#NEXT_LEVEL") + "'>next level</a>...",
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
},
{
	caption: "Loops 3",
	map: // Level 4.
		/**
		 * Note, the path continues past the start and the goal in both directions.
		 * This is intentionally done so users see the maze is about getting from
		 * the start to the goal and not necessarily about moving over every part of
		 * the maze, 'mowing the lawn' as Neil calls it.
		 */
		 [[0, 0, 0, 0, 0, 0, 0, 1],
		  [0, 0, 0, 0, 0, 0, 1, 1],
		  [0, 0, 0, 0, 0, 1, 3, 0],
		  [0, 0, 0, 0, 1, 1, 0, 0],
		  [0, 0, 0, 1, 1, 0, 0, 0],
		  [0, 0, 1, 1, 0, 0, 0, 0],
		  [0, 2, 1, 0, 0, 0, 0, 0],
		  [1, 1, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 5,
	blocks: blocksB,
},
{
	caption: "Advanced loops 1",
	map: // Level 5.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 3, 0, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 0, 0, 2, 1, 1, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 5,
	blocks: blocksB,
},
{
	caption: "Advanced loops 2",
	map:
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 1, 3, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 0, 0, 1, 1, 1, 0, 0],
		  [0, 0, 0, 1, 0, 1, 0, 0],
		  [0, 2, 1, 1, 1, 1, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 7,
	blocks: blocksB,
},
{
	caption: "Loops - mission impossible",
	helpText: "Try the <a href='" + BlocklyUtils.nextLevelURL("#NEXT_LEVEL") + "'>next level</a>...",
	map: // Level 6.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 1, 1, 1, 1, 1, 0, 0],
		  [0, 1, 0, 0, 0, 1, 0, 0],
		  [0, 1, 1, 3, 0, 1, 0, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 2, 1, 1, 1, 1, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 5,
	blocks: blocksB,
},
{
	caption: "Control statements",
	map: // Level 6.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 1, 1, 1, 1, 1, 0, 0],
		  [0, 1, 0, 0, 0, 1, 0, 0],
		  [0, 1, 1, 3, 0, 1, 0, 0],
		  [0, 0, 0, 0, 0, 1, 0, 0],
		  [0, 2, 1, 1, 1, 1, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 5,
	blocks: blocksC,
},
{
	caption: "Maze 1",
	map: // Level 7.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 1, 1, 0],
		  [0, 2, 1, 1, 1, 1, 0, 0],
		  [0, 0, 0, 0, 0, 1, 1, 0],
		  [0, 1, 1, 3, 0, 1, 0, 0],
		  [0, 1, 0, 1, 0, 1, 0, 0],
		  [0, 1, 1, 1, 1, 1, 1, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 5,
	blocks: blocksC,
},
{
	caption: "Maze 2",
	map: // Level 8.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 1, 1, 1, 1, 0, 0, 0],
		  [0, 1, 0, 0, 1, 1, 0, 0],
		  [0, 1, 1, 1, 0, 1, 0, 0],
		  [0, 0, 0, 1, 0, 1, 0, 0],
		  [0, 2, 1, 1, 0, 3, 0, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 10,
	blocks: blocksC,
},
{
	caption: "Advanced Maze 1",
	map: // Level 9.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 1, 1, 1, 1, 1, 0, 0],
		  [0, 0, 1, 0, 0, 0, 0, 0],
		  [3, 1, 1, 1, 1, 1, 1, 0],
		  [0, 1, 0, 1, 0, 1, 1, 0],
		  [1, 1, 1, 1, 1, 0, 1, 0],
		  [0, 1, 0, 1, 0, 2, 1, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 7,
	blocks: blocksD,
},
{
	caption: "Advanced Maze 2",
	map: // Level 10.
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 1, 1, 0, 3, 0, 1, 0],
		  [0, 1, 1, 0, 1, 1, 1, 0],
		  [0, 1, 0, 1, 0, 1, 0, 0],
		  [0, 1, 1, 1, 1, 1, 1, 0],
		  [0, 0, 0, 1, 0, 0, 1, 0],
		  [0, 2, 1, 1, 1, 0, 1, 0],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 10,
	blocks: blocksD,
}

];