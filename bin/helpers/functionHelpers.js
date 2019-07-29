const bcrypt = require('bcrypt');
const {getUserByEmailDB, getUserByUsernameDB, addUserDB} = require('./dbHelpers.js');

//generate hashed password
const generateHashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

//generate cookie session
const generateCookie = (email) => {
  console.log('cookie1');
  req.session.email_id = email;
  console.log('cookie2');
};

//check if email already exists
const emailExists = (email) => {
  return getUserByEmailDB(email).then((result) => {
    if (result) {
      return result.email;
    }
    return false;
  });
};

const usernameExists = (username) => {
  return getUserByUsernameDB(username).then((result) => {
    if (result) {
      return result.username;
    }
    return false;
  });
};

//verify if password entered is correct
const validatePassword = (email, password) => {
  return getUserByEmailDB(email)
    .then((user) => bcrypt.compare(password, user.password))
    .then(() => {
      console.log('here12345');
      return generateCookie(email);
      console.log('here54321');
    });
};

const addUser = (username, email, password) => {
  addUserDB(username, email, generateHashedPassword(password)).then((newUser) => {
    if (newUser) {
      return newUser;
    }
    return false;
  });
};
module.exports = {generateHashedPassword, usernameExists, emailExists, validatePassword, generateCookie, addUser};
