
'use strict';

var BlocklyEditor = BlocklyEditor || {};
BlocklyEditor.groupA = [
	{ b:"pegman_moveForward" },
	{ b:"pegman_turn", f:["DIR", "turnLeft"] },
	{ b:"pegman_turn", f:["DIR", "turnRight"] }
];
BlocklyEditor.groupB = _.union(BlocklyEditor.groupA, [{ b:"block_forever" }]);
BlocklyEditor.groupC = _.union(BlocklyEditor.groupB, [{ b:"block_if" }]);
BlocklyEditor.groupD = _.union(BlocklyEditor.groupC, [{ b:"block_ifElse" }]);


var SourceEditor = SourceEditor || {};
SourceEditor.groupA = [
	"Pegman.moveForward()",
	"Pegman.turnLeft()",
	"Pegman.turnRight()"
];
SourceEditor.groupB = _.union(SourceEditor.groupA, [ "\nwhile(true) {\n}\n" ]);
SourceEditor.groupC = _.union(SourceEditor.groupB, [
	"Pegman.isPathForward()",
	"Pegman.isPathLeft()",
	"Pegman.isPathRight()",
	"\nif (condition) {\n}\n",
]);
SourceEditor.groupD = _.union(SourceEditor.groupC, [ "\nif (condition) {\n} else {\n}\n" ]);
SourceEditor.groupE = _.union(SourceEditor.groupD, [ "\nfor (var i = 0; i < 5; ++i) {\n}\n" ]);
SourceEditor.groupF = _.union(SourceEditor.groupE, [ "\nfunction move(n) {\n}\n" ]);


var Levels = [
{ // 1
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
	blocks: "groupA",
	editor: BlocklyEditor,
},
{ // 2
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
	blocks: "groupA",
	editor: BlocklyEditor,
},
{ // 3
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
	blocks: "groupA",
	editor: SourceEditor,
},
{ // 4
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
	blocks: "groupA",
	editor: BlocklyEditor,
},
{ // 5
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
	blocks: "groupB",
	editor: BlocklyEditor,
},
{ // 6
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
	blocks: "groupB",
	editor: BlocklyEditor,
},
{ // 7
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
	blocks: "groupB",
	editor: BlocklyEditor,
},
{ // 8
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
	blocks: "groupB",
	editor: SourceEditor,
},
{ // 9
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
	blocks: "groupB",
	editor: BlocklyEditor,
},
{ // 10
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
	blocks: "groupC",
	editor: BlocklyEditor,
},
{ // 11
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
	blocks: "groupC",
	editor: BlocklyEditor,
},
{ // 12
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
	blocks: "groupC",
	editor: BlocklyEditor,
},
{ // 13
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
	blocks: "groupD",
	editor: BlocklyEditor,
},
{ // 14
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
	blocks: "groupD",
	editor: BlocklyEditor,
},
{ // 15
	caption: "Coding 101",
	map:
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 2, 1, 0, 0, 1, 1, 0],
		  [0, 1, 1, 0, 0, 1, 1, 0],
		  [0, 1, 0, 1, 1, 0, 1, 0],
		  [0, 1, 1, 1, 1, 1, 1, 0],
		  [0, 1, 0, 1, 1, 0, 1, 0],
		  [1, 1, 1, 0, 0, 1, 1, 3],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 4,
	blocks: "groupD",
	editor: SourceEditor,
},
{ // 16
	caption: "For loop + variables",
	map:
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 2, 1, 0, 0, 1, 1, 0],
		  [0, 1, 1, 0, 0, 1, 1, 0],
		  [0, 1, 0, 1, 1, 0, 1, 0],
		  [0, 1, 1, 1, 1, 1, 1, 0],
		  [0, 1, 0, 1, 1, 0, 1, 0],
		  [1, 1, 1, 0, 0, 1, 1, 3],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 4,
	blocks: "groupE",
	editor: SourceEditor,
},
{ // 17
	caption: "functions",
	map:
		 [[0, 0, 0, 0, 0, 0, 0, 0],
		  [0, 2, 1, 0, 0, 1, 1, 0],
		  [0, 1, 1, 0, 0, 1, 1, 0],
		  [0, 1, 0, 1, 1, 0, 1, 0],
		  [0, 1, 1, 1, 1, 1, 1, 0],
		  [0, 1, 0, 1, 1, 0, 1, 0],
		  [1, 1, 1, 0, 0, 1, 1, 3],
		  [0, 0, 0, 0, 0, 0, 0, 0]],
	maxBlocks: 4,
	blocks: "groupF",
	editor: SourceEditor,
}

];
