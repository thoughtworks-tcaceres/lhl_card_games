console.log('just log something here')


$(document).ready(function() {
  kingsCupRockHandler();
  kingsCupPaperHandler();
  kingsCupScissorHandler();
});

const kingsCupRockHandler = function() {
  $('#kingsCupRock').on('click', function() {
    console.log('rock')
    socket.emit('kingsCupSelection', 'rock');
  });
}

const kingsCupPaperHandler = function() {
  $('#kingsCupPaper').on('click', function() {
    console.log('paper')
    socket.emit('kingsCupSelection', 'paper');
  });
}

const kingsCupScissorHandler = function() {
  $('#kingsCupScissor').on('click', function() {
    console.log('scissor')
    socket.emit('kingsCupSelection', 'scissor');
  });
}

