'use strict';

//document.getElementById('canvas').remove();
var game = new Phaser.Game(400, 400, Phaser.AUTO, 'canvas', {}, true);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('maze', mazeState);

game.state.start('boot');
//game.state.start('maze');


