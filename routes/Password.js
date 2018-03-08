var bcrypt = require('bcrypt');

const saltRounds = 14;

module.exports.hashPassword = async function (password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw err;
  }
}

module.exports.comparePassword