// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 1000;
const ENV = process.env.ENV || 'development';
const express = require('express');
const sass = require('node-sass-middleware');
const app = express();
const morgan = require('morgan');

//additional setups
const flash = require('connect-flash');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const db = require('./db/db');
db.connect();

//dev tool
app.use(morgan('dev'));

app.use(
  cookieSession({
    name: 'session',
    keys: ['lhl_card_games']
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user;
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
