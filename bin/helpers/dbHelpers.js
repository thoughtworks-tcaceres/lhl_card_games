const db = require('../../db/db');

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

//insert initial record
const addRecordDB = (game_id) => {
  const queryString = `INSERT INTO records (game_id)
                      VALUES ($1) RETURNING *;`;
  const queryParams = [`${game_id}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'add_record_db'
    })
    .then((res) => {
      return res.rows[0];
    });
};

//insert initial session
const addSessionDB = (user_id, record_id) => {
  const queryString = `INSERT INTO sessions (user_id, record_id)
                      VALUES ($1, $2) RETURNING *;`;
  const queryParams = [`${user_id}`, `${record_id}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'add_session_db'
    })
    .then((res) => {
      return res.rows[0];
    });
};

//insert initial session
const addSessionFlexibleDB = (email_arr, record_id) => {
  const queryString = `INSERT INTO sessions (user_id, record_id)
                      SELECT id, $2
                      FROM users
                      WHERE email = ANY(ARRAY[$1]::text[])
                      RETURNING *;`;
  const queryParams = [email_arr, `${record_id}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'add_session_flexible_db'
    })
    .then((res) => {
      return res.rows;
    });
};

//insert initial record
const updateRecordDB = (game_id) => {
  const queryString = `UPDATE records
                      SET end_time = CURRENT_TIMESTAMP
                      WHERE game_id = $1
                      RETURNING *;`;
  const queryParams = [`${game_id}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'update_record_db'
    })
    .then((res) => {
      return res.rows[0];
    });
};

//insert initial session
const updateSessionDB = (user_id, record_id) => {
  const queryString = `UPDATE sessions
                      SET win = true
                      WHERE user_id = $1 and record_id = $2
                      RETURNING *;`;
  const queryParams = [`${user_id}`, `${record_id}`, `${win}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'update_session_db'
    })
    .then((res) => {
      return res.rows[0];
      ß;
    });
  ß;
};

const updateSessionFlexibleDB = (user_id, record_id) => {
  const queryString = `UPDATE sessions
                      SET win = true
                      WHERE user_id = $1 and record_id = $2
                      RETURNING *;`;
  const queryParams = [`${user_id}`, `${record_id}`];
  return db
    .query({
      text: queryString,
      values: queryParams,
      name: 'update_session_flexible_db'
    })
    .then((res) => {
      return res.rows[0];
    });
};

module.exports = {
  getAllUsersDB,
  getUserByUsernameDB,
  getUserByEmailDB,
  addUserDB,
  getAllGameInfoDB,
  getAllGameSessionsDB,
  getAllGameRecordsDB,
  getUserGameRecordsDB,
  addRecordDB,
  addSessionDB,
  updateRecordDB,
  updateSessionDB,
  addSessionFlexibleDB,
  updateSessionFlexibleDB
};
