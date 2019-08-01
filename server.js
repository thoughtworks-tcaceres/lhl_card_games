// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const sass = require('node-sass-middleware');
const app = express();
const morgan = require('morgan');
const socket = require('socket.io');
const session = require('express-session')({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
});
const sharedsession = require('express-socket.io-session');

const game_data = require('./db/tempDB.js');

const {
  getAllUsersDB,
  getUserByUsernameDB,
  getUserByEmailDB,
  addUserDB,
  getAllGameInfoDB,
  getAllGameSessionsDB,
  getAllActiveGameSessionsDB,
  getAllGameRecordsDB,
  getUserGameRecordsDB,
  addRecordDB,
  addSessionDB,
  updateRecordDB,
  updateSessionDB,
  addSessionFlexibleDB,
  updateSessionFlexibleDB
} = require('./bin/helpers/dbHelpers.js');

const {
  getRoomGameId,
  getNumberOfUsers,
  getJoinedRooms,
  validateNewRoom,
  insertNewRoom,
  nameRefine
} = require('./bin/helpers/functionHelpers');
//additional setups
const flash = require('connect-flash');

// PG database client/connection setup
const db = require('./db/db');
db.connect();

//dev tool
app.use(morgan('dev'));

app.use(session);

app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.email;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded'
  })
);
app.use(express.static(__dirname + '/public'));

// ***** routes *****
const apiRoutes = require('./routes/api');
const gamesRoutes = require('./routes/games');
const usersRoutes = require('./routes/users');
const rankingsRoutes = require('./routes/rankings');
const defaultRoutes = require('./routes/default');

app.use('/api', apiRoutes);
app.use('/games', gamesRoutes);
app.use('/users', usersRoutes);
app.use('/rankings', rankingsRoutes);
app.use('/', defaultRoutes);

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const io = socket(server);

io.use(
  sharedsession(session, {
    autoSave: true
  })
);

// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE

const {socketForKingsCup} = require('./public/scripts/kingsCup/serverSide');

const kingsCupData = {};
const userCurrentRoom = {};

// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE
// MY NEW STUFFS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE

io.on('connection', (socket) => {
  console.log('user email cookie:', socket.handshake.session.email);
  console.log('USER INFORMATION: ', socket.handshake.headers);

  // //on game start up - add record and session
  // addRecordDB(3) //(game_id)
  //   .then(
  //     (data) => addSessionFlexibleDB(['t@gmail.com', 'a@gmail.com'], data.id)
  //     /*
  //     get list of userNames in the room, create a record in the sessions
  //     database for each user
  //     */
  //   ) //(user_id,record_id) -- need to find all the users --> uses(email_arr,record_id)
  //   .catch((err) => console.log(err));

  // //on game completion - update record and session
  // updateRecordDB(2) //(game_id)
  //   .then((data) => updateSessionFlexibleDB('t@gmail.com', data.id))
  //   //array of object that updates each rank for a single --> same thing as regularupdate session?
  //   .catch((err) => console.log(err));

  let currentRoom;
  
  //00000000000000000000000000000000000
  userCurrentRoom[socket.id] = null;
  //000000000000000000000000000

  // Handle the event when the user is disconnected

  socket.on('disconnect', () => {

    //0000000000000000000000000000
    delete userCurrentRoom[socket.id];
    //0000000000000000000000000000000

    if (!currentRoom) {
      return;
    }
    let room_info = io.sockets.adapter.rooms[currentRoom];
    let roomGameId = getRoomGameId(currentRoom);
    if (room_info) {
      if (
        Object.keys(room_info.sockets).length < game_data[roomGameId.gameId].min_players ||
        Object.keys(room_info.sockets).length ===
          game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers.length
      ) {
        game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers = [];
      }
      io.sockets
        .to(currentRoom)
        .emit('updateRoomStatus', [
          Object.keys(room_info.sockets),
          currentRoom,
          game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers,
          socket.id,
          game_data[roomGameId.gameId].min_players
        ]);
    } else {
      game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers = [];
    }
  });

  // Create new room

  socket.on('createNewRoom', (data) => {
    insertNewRoom(data.roomId, data.gameId, data.passcode, game_data);
    io.sockets.emit('createNewRoom', data);
  });

  // Join a room

  socket.on('joinARoom', (data) => {
    // Check number of users

    const numberOfExistingUsers = getNumberOfUsers(data.gameId, data.roomId, io);
    if (numberOfExistingUsers >= game_data[data.gameId].max_players) {
      console.log('Room is full');
      return;
    }

    // Check to see if user is trying to join the room he/she has already joined

    const uniqueRoomName = `${data.gameId}-${data.roomId}`;
    const joinedRooms = getJoinedRooms(game_data, io, socket.id);
    if (joinedRooms.includes(uniqueRoomName)) {
      return;
    }

    // Leave all the rooms

    for (let joinedRoom of joinedRooms) {
      socket.leave(joinedRoom);
      let room_info = io.sockets.adapter.rooms[joinedRoom];
      let roomGameId = getRoomGameId(joinedRoom);
      if (room_info) {
        if (
          Object.keys(room_info.sockets).length < game_data[roomGameId.gameId].min_players ||
          Object.keys(room_info.sockets).length ===
            game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers.length
        ) {
          game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers = [];
        }
        io.sockets
          .to(joinedRoom)
          .emit('updateRoomStatus', [
            Object.keys(room_info.sockets),
            joinedRoom,
            game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers,
            socket.id,
            game_data[roomGameId.gameId].min_players
          ]);
      } else {
        game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers = [];
      }
    }

    // Join the room

    currentRoom = uniqueRoomName;

    ///000000000000000000000000000000000000000
    userCurrentRoom[socket.id] = currentRoom;
    //0000000000000000000000000000000000000

    socket.join(uniqueRoomName);
    const clients = io.sockets.adapter.rooms[uniqueRoomName].sockets;
    io.sockets
      .to(uniqueRoomName)
      .emit('updateRoomStatus', [
        Object.keys(clients),
        currentRoom,
        game_data[data.gameId].room_data[data.roomId].joinedPlayers,
        socket.id,
        game_data[data.gameId].min_players
      ]);
  });

  // Trigger user joining event

  socket.on('handleJoinGameEvent', (data) => {
    const clients = io.sockets.adapter.rooms[currentRoom].sockets;
    const roomGameId = getRoomGameId(currentRoom);
    game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers.push(socket.id);
    if (Object.keys(clients).length > game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers.length) {
      io.sockets
        .to(currentRoom)
        .emit('updateRoomStatus', [
          Object.keys(clients),
          currentRoom,
          game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers,
          socket.id,
          game_data[roomGameId.gameId].min_players
        ]);
    } else if (Object.keys(clients).length === game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers.length) {
      io.sockets.to(currentRoom).emit('directToGame', {uniqueRoomName: currentRoom, gameId: roomGameId.gameId});

      // ADD MY STUFFS HERE

      if (roomGameId.gameId === 'whosbigger') {
        console.log('We are joining this: ', roomGameId.gameId);
      } else if (roomGameId.gameId === 'kingsCup') {
        //////////
        console.log('We are joining this: ', roomGameId.gameId)
        io.sockets.to(currentRoom).emit('kingsCupSetUp', [
          game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers
        ]);
        kingsCupData[currentRoom] = {};
        for (let id of game_data[roomGameId.gameId].room_data[roomGameId.roomId].joinedPlayers) {
          kingsCupData[currentRoom][id] = false;
        }
        console.log('status here', kingsCupData)
        ////////////////////
      } else if (roomGameId.gameId === 'blackjack') {
        console.log('We are joining this: ', roomGameId.gameId)
      } else if (roomGameId.gameId === 'goofy') {
        console.log('We are joining this: ', roomGameId.gameId)
      }
      

    }
  });


  socketForKingsCup(io, socket, kingsCupData, userCurrentRoom);


});