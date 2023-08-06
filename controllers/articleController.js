const Article = require('../models/article');

exports.post = async (req, res) => {
    try {
        // 클라이언트로부터 게시글 데이터 가져오기
        const { author, content } = req.body;
        console.log(`In post function, content => ${content}`);

        // 인증된 사용자의 ID를 사용하여 author를 설정
        // (이 경우에는 authMiddleware에서 설정된 req.userId를 사용합니다)
        const userId = req.userId;

        // 게시글 생성
        const newArticle = await Article.create({
            author: userId,  // 또는 author: author
            content
        });

        console.log(`In post function, newArticle.author => ${newArticle.author}, newArticle.content => ${newArticle.content}`);

        // 성공 응답 반환
        res.status(201).json({
            message: "Article created successfully",
            article: newArticle
        });
    } catch (error) {
        // 에러 응답 반환
        res.status(500).json({
            message: "Error creating article",
            error: error.message
        });
    }
};
