require('dotenv').config();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const validations = require('../utils/validations');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  console.log(`In register function, email => ${email}, password => ${password}`);

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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`In login function, email => ${email}, password => ${password}`);

  if (!validations.isValidEmail(email)) {
    console.log("Email validation was failed");
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!validations.isValidPassword(password)) {
    console.log("Password validation was failed");
    return res.status(400).json({ message: "Invalid password format" });
  }

  // 이메일이 DB에 있는지 확인
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  // 비밀번호가 맞는지 확인
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  // 사용자 인증에 성공하면 JWT 토큰 생성
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h'  // 토큰의 유효 기간 설정 (1시간)
  });

  res.status(200).json({ message: "Logged in successfully", token });
};
