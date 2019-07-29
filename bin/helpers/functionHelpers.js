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
  return getUserByEmailDB(email)
    .then((user) => bcrypt.compare(password, user.password))
    .then((result) => {
      console.log('before error');
      if (result) {
        console.log('here12345');
        generateCookie(user.email);
        console.log('here54321');
        return true;
      }
      console.log('error here');
      throw new Error();
    });
};

//generate cookie session
const generateCookie = (email) => {
  req.session.user = email;
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
