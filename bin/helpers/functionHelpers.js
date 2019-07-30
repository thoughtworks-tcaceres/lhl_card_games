const bcrypt = require('bcrypt');
const {getUserByEmailDB, getUserByUsernameDB, addUserDB} = require('./dbHelpers.js');

//generate hashed password
const generateHashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
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
  return getUserByEmailDB(email).then((user) => bcrypt.compare(password, user.password));
};

const addUser = (username, email, password) => {
  addUserDB(username, email, generateHashedPassword(password)).then((newUser) => {
    if (newUser) {
      return newUser;
    }
    return false;
  });
};

module.exports = {generateHashedPassword, usernameExists, emailExists, validatePassword, addUser};
