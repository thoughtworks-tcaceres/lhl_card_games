//const Game = require('../../../Games/KingsCup.js')

const kingsCup2 = function(io, socket, kingsCup2Data, userCurrentRoom) {
  // IMPORTANT
  //

  ////

  //   const dataForThisUser = kingsCup2Data[myRoom][socket.id]

  socket.on('draw card button clicked', (data) => {
    const myRoom = userCurrentRoom[socket.id];
    const game = kingsCup2Data[myRoom].game;

    console.log('first branch about to happen');
    io.to(myRoom).emit('kcdrawcard', `${game.dealCard(socket.id)}`);
    console.log('event 2 about to happen');
    game.iteratePlayer();
    console.log('event 3 about to happen');
    io.to(game.playerPool[game.playerTurnNumber]).emit('kcdealbutton');
    console.log('event 4 about to happen');
  });
};

module.exports = {kingsCup2};
