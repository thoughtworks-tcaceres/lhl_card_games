
const Deck = require('./Deck')
const Player = require('./Player')

class KingsCup{

    constructor(sockets, gameRoomName){
        this.endGame = false;
        this.roomName = gameRoomName;
        this.playerPool = {};
        this.playerQueue = [];
    
        this.setupPlayers(sockets);
        this.setupPlayerQueue(this.playerPool)
        this.playerTurnNumber = 0;

        this.deck = new Deck();
        this.deck.newDeck();
        this.deck.shuffle();

        this.bestPlayer = null;

        console.log(this.playerQueue)
    }

    setupPlayers(sockets){
        
        for(let socket in sockets){
            this.playerPool[socket] = new Player(socket)
            }
        }
    setupPlayerQueue(){
        for(let player in this.playerPool){
            this.playerQueue.push(this.playerPool[player].id)
        }
    }
    dealCard(playerID){
        const player = this.playerPool[playerID];
        player.drawCard(this.deck);
        return player.getHand()[player.getHand().length-1];
    }

    setEndGame(bool){
        this.endGame = bool;
    }
    getEndGame(){
        return this.endGame;
    }
    iteratePlayer(){
        if(this.playerTurnNumber === this.playerQueue.length -1){
            this.playerTurnNumber = 0;
        }else{
            this.playerTurnNumber ++;
        }
        return this.playerPool[this.playerQueue[this.playerTurnNumber]]
    }

    getDeck(){
        return this.deck;
    }
    startGame(){
        while(!this.getEndGame()&& this.getDeck().getLength() > 0){

            //get players turn 
            //on player click
            //if they are player get new card 
            //display to all
            //rotate player / set player = true in html
            //check deck size != 0
            //if deck size = 0
           
//show cards to all players (broadcast to rooms)
//



            this.iteratePlayer();


        if(this.getDeck().getLength() <=0) this.setEndGame(true);
        
    }


}}

