// const {
//   getRoomGameId,
//   getNumberOfUsers,
//   getJoinedRooms,
//   validateNewRoom,
//   insertNewRoom,
//   nameRefine
// } = require('./bin/helpers/functionHelpers');

const socketForKingsCup = function(io, socket, kingsCupData, userCurrentRoom) {
  
  // io.on('connection', (socket) => {

  console.log('ENTERING SERVER FOR KINGSCUP!!!')
  console.log(socket.id);

  socket.on('kingsCupSelection', (data) => {
    console.log('I see you have given ', data);

    // console.log(kingsCupData);
    // console.log(userCurrentRoom)
    // console.log(socket.id)
    // userCurrentRoom[socket.id]

    kingsCupData[userCurrentRoom[socket.id]][socket.id] = data;

    if (kingsCupReadyStatus(kingsCupData, userCurrentRoom[socket.id])) {
      console.log("BATTLE!!!");

      console.log('userCurrentRoom HERE: ', userCurrentRoom)
      console.log('kingsCupData HERE: ', kingsCupData)

    } else {
      console.log('wait for other user');
      io.sockets.to([userCurrentRoom[socket.id]]).emit('kingsCupWaitForResponse', [
        kingsCupData[userCurrentRoom[socket.id]]
      ]);
    }

    // if (kingsCupData[currentRoom].includes(false)) {

    // } else {

    // };
      
    });
  // });
};



module.exports = { socketForKingsCup };


// -------------------- Helper functions --------------------------------------

const kingsCupReadyStatus = function(kingsCupData, currentRoom) {
  for (let key in kingsCupData[currentRoom]) {
    if (kingsCupData[currentRoom][key] === false) {
      return false;
    };
  };
  return true;
};