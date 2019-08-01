const socketForKingsCup = function(io, socket) {
  
  // io.on('connection', (socket) => {

    console.log('ENTERING SERVER FOR KINGSCUP!!!')
    console.log(socket.id);

    socket.on('kingsCupSelection', (data) => {
      console.log('I see you have given ', data);


      
    });
  // });
};



module.exports = { socketForKingsCup };