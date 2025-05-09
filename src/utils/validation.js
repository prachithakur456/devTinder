const validator = require("validator");

const validateUser = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "desc", "gender", "password", "photoUrl"];
  const isValidUser = Object.keys(req.body).every((fields) =>
    allowedEditFields.includes(fields)
  );
  return !!isValidUser;
};

module.exports = { validateUser, validateEditProfile };
