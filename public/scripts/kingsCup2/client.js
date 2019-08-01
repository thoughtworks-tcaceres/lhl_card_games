





let gameRules= {
    02: "YOU: Choose someone to drink",
    03: "ME: You drink",
    04: "FLOOR: The last person to touch the floor drinks",
    05: "GUYS: Guys drink",
    06: "CHICKS (with....): Girls drink",
    07: "HEAVEN: Raise your hand to heaven. The last person to do so drinks.",
    08: "MATE: Choose someone to be your mate. Any time you drink they drink",
    09: "RHYME: Say a word. The person to your right says a word that rhymes. The first person to fail drinks",
    11: "TEN: Choose a category of things. The person to your irght names something in that category. The first person to fail drinks.",
    12: "NEVER HAVE I EVER: Play never have I ever",
    13: "QUESTIONS: Ask someone A question. That person then asks someone else a question. The first person to fail drinks",
    14: "WATERFALL: Start drinking at the same time as the person to your left. Don't stop until they do.",
}






function renderListOfPlayers(insertElement, playerNumber){
    for(let i = 0; i < playerNumber; i ++){
        insertElement.innerHTML += `<div class = "player"> player${i}</div>`
    }
}

function getRules(insertCardRule, insertCardImg, card){
    insertCardImg.innerHTML = `<img class = "jpg" src = "${"__card___url"}">`
    insertCardRule.innerHTML = `<div class = "cards">${gameRules[card.substring(0,2)]}</div>`
}



// $(document).ready(function() {

// });

socket.on('kingsCup2Attendance', (data) => {

  console.log('goes to emit')
  console.log('--------------------', data)

  const userList = document.getElementById('kingsCup2JayJayDidThis');
  userList.innerHTML = "<p>USER LIST: </P>";
  for (let id in data[0]) {
    userList.innerHTML += `<p>${id}</p>`;
  }
})