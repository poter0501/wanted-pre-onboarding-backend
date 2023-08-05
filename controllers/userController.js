const User = require('../models/user');
const bcrypt = require('bcrypt');
const validations = require('../utils/validations')

exports.register = async (req, res) => {
  const { email, password } = req.body;
  console.log(`email => ${email}, password => ${password}`);

  if (!validations.isValidEmail(email)) {
    console.log("Email validation was failed");
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!validations.isValidPassword(password)) {
    console.log("Password validation was failed");
    return res.status(400).json({ message: "Invalid password format" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashPassword
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    // 중복된 email error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "An error occurred", error });
  }
};
