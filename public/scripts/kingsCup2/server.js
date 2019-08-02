//const Game = require('../../../Games/KingsCup.js')

const kingsCup2 = function(io, socket, kingsCup2Data, userCurrentRoom){


    socket.on('whatever', (data) => {
        const myRoom = userCurrentRoom[socket.id];
        const game =  kingsCup2Data[myRoom].game;
        
        
       //console.log(game.getPlayers() );
       io.to(myRoom).emit('kcdraw',`${game.dealCard(socket.id)}`)



        //io.sockets.to(myRoom).emit('someName', [])
       // let game = new Game()

    })


 //console.log("look here =======", dataForThisUser);
 //console.log("look here ==============")


  //let kingsCup = new Game(io.sockets.adapter.rooms['woodpecker'].sockets, 'woodpecker');

  //console.log(kingsCup)


  
}


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
