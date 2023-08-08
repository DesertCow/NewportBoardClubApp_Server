
const jwt = require('jsonwebtoken');


module.exports = {

  signToken: function ({ memberEmail, memberFirstName,memberLastName, _id }) {
    const payload = { memberEmail, memberFirstName, memberLastName, _id };
    return jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_VALID_LENGTH });
  },

  signAdminToken: function ({ adminEmail, adminValid }) {
    const payload = { adminEmail, adminValid };
    return jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_VALID_LENGTH });
  },
  
};