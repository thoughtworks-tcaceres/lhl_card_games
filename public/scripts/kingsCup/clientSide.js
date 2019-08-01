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

//-------------------------------------
let kingsCupStatusElement = document.getElementById('kingsCupUserStatus');

socket.on('kingsCupSetUp', (data) => {
  console.log('display user data now');
  // $('#kingsCupUserStatus').innerHTML
  console.log(data)
  
  kingsCupStatusElement.innerHTML = "";
  for (let user of data[0]) {
    kingsCupStatusElement.innerHTML += `<p>${user}</p>`;
  }
});

socket.on('kingsCupWaitForResponse', (data) => {
  kingsCupStatusElement.innerHTML = "";
  for (let id in data[0]) {
    if (data[0][id]) {
      kingsCupStatusElement.innerHTML += `<p style="color: green;">${id} is ready to battle!</p>`;
    } else {
      kingsCupStatusElement.innerHTML += `<p>${id}</p>`;
    };
  }
});