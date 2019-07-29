const db = require('../../db/db');

// ***** table: users *****
//select all users
const getAllUsersDB = () => {
  const queryString = `SELECT * FROM users;`;
  return db
    .query({
      text: queryString,
      values: [],
      name: 'get_all_users'
    })
    .then((res) => res.rows);
};

// select specific user by username
const getUserByUsernameDB = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1;`;
  const queryParams = [`${username}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'get_user_by_username'
    })
    .then((res) => res.rows[0]);
};

//select specific user
const getUserByEmailDB = (email) => {
  const queryString = `SELECT * FROM users WHERE email = $1;`;
  const queryParams = [`${email}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'get_user_by_email'
    })
    .then((res) => res.rows[0]);
};

//add user
const addUserDB = (username, email, password) => {
  const queryString = `INSERT INTO users (username, email, password)
                      VALUES ($1, $2, $3) RETURNING *;`;
  const queryParams = [`${username}`, `${email}`, `${password}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'add_user_db'
    })
    .then((res) => {
      return res.rows[0];
    });
};

// ***** table: games *****
//all game info
const getAllGameInfoDB = () => {
  const queryString = `SELECT * FROM games;`;
  return db
    .query({
      text: queryString,
      values: [],
      name: 'get_all_game_info'
    })
    .then((res) => res.rows);
};

// ***** table: sessions *****
//all game sessions
const getAllGameSessionsDB = () => {
  const queryString = `SELECT * FROM sessions;`;
  return db
    .query({
      text: queryString,
      values: [],
      name: 'get_all_game_sessions'
    })
    .then((res) => res.rows);
};

//get active game sessions
const getAllActiveGameSessionsDB = () => {
  const queryString = `SELECT * FROM sessions WHERE is_active = 'true';`;
  return db
    .query({
      text: queryString,
      values: [],
      name: 'get_all_active_game_sessions'
    })
    .then((res) => res.rows);
};

// ***** table: records *****
//get all game records
const getAllGameRecordsDB = () => {
  const queryString = `SELECT * FROM records;`;
  return db
    .query({
      text: queryString,
      values: [],
      name: 'get_all_game_records'
    })
    .then((res) => res.rows);
};

//get game records for specific user
const getUserGameRecordsDB = (username) => {
  const queryString = `SELECT *
    FROM records r
    JOIN sessions s ON r.id = s.record_id
    JOIN users u on s.user_id = u.id
    WHERE username = $1;`;
  return db
    .query({
      text: queryString,
      values: [`${username}`],
      name: 'get_user_game_records'
    })
    .then((res) => res.rows);
};

module.exports = {
  getAllUsersDB,
  getUserByUsernameDB,
  getUserByEmailDB,
  addUserDB,
  getAllGameInfoDB,
  getAllGameSessionsDB,
  getAllActiveGameSessionsDB,
  getAllGameRecordsDB,
  getUserGameRecordsDB
};
