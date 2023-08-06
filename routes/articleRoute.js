const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const articleController = require('../controllers/articleController');

// authMiddleware를 통해 토큰 검증 후 라우팅
router.post('/post', authMiddleware, articleController.post);

module.exports = router;
