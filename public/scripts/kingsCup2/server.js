const Game = require('../../../Games/WhosBigger')

const kingsCup2 = function(io, sockets, kingsCup2Data, userCurrentRoom){


  // IMPORTANT
  const myRoom = userCurrentRoom[socket.id];

  ////

  const dataForThisUser = kingsCup2Data[myRoom][socket.id]


  sockets.join('woodpecker');
  let gameInstance = (io.sockets.adapter.rooms['woodpecker'].game = new Game({234:true, 235:true, 456:true}, 'hello'));
  console.log("LOOK HERERERERE",gameInstance.getPlayers());


  //let kingsCup = new Game(io.sockets.adapter.rooms['woodpecker'].sockets, 'woodpecker');

  //console.log(kingsCup)


  
}









module.exports = { kingsCup2 };