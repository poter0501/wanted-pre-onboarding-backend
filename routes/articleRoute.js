const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const articleController = require('../controllers/articleController');

// authMiddleware를 통해 토큰 검증 후 라우팅
router.post('/post', authMiddleware, articleController.post); // 게시글 생성
router.get('/list', articleController.list);  // 게시글 목록 조회
router.get('/:id', articleController.getArticleById);  // 게시글 ID를 통해 게시글 조회

module.exports = router;
