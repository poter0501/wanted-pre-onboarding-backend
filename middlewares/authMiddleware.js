require('dotenv').config();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    // "Bearer " 접두사 제거
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }

        req.userId = decoded.id;  // 사용자 ID를 req 객체에 저장
        next();
    });
};
