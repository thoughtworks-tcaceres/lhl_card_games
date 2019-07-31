// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 1000;
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
  generateHashedPassword,
  usernameExists,
  emailExists,
  validatePassword,
  addUser
} = require('./bin/helpers/functionHelpers.js');

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

io.on('connection', (socket) => {
  console.log('user email cookie:', socket.handshake.session.email);

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

  socket.on('creatingRoom', (data) => {
    if (room_data[data.roomName]) {
    } else {
      room_data[data.roomName] = {};
      io.sockets.emit('creatingRoom', data);
    }
  });
  socket.on('joiningRoom', (data) => {
    socket.join(data);
    let clients = io.sockets.adapter.rooms[data].sockets;
    io.sockets.to(data).emit('addingNewUser', clients);
  });

  socket.on('leavingRoom', () => {
    console.log('LOOK HERER SDLFKJSD : ', socket.rooms);
    const roomsLeft = socket.rooms;
    socket.leaveAll();
    console.log('leave all');
    for (let room in roomsLeft) {
      console.log(room);
      //io.to(room).emit('addingNewUser', clients);
    }
  });
});
