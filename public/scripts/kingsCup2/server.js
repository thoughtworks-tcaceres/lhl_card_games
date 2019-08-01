//const Game = require('../../../Games/KingsCup.js')

const kingsCup2 = function(io, socket, kingsCup2Data, userCurrentRoom){


  // IMPORTANT
// 

  ////

//   const dataForThisUser = kingsCup2Data[myRoom][socket.id]

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









module.exports = { kingsCup2 };