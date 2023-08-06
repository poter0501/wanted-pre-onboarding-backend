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
exports.list = async (req, res) => {
    console.log(`In list function, req => ${req}`)
    try {
        const page = parseInt(req.query.page) || 1;  // 기본값은 1페이지
        const limit = parseInt(req.query.limit) || 10; // 기본값은 10개

        // offset 계산
        const offset = (page - 1) * limit;

        const { count, rows } = await Article.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']] // 최신 게시글부터 반환
        });

        // 페이지네이션 메타 데이터
        const totalPages = Math.ceil(count / limit);
        const pagination = {
            totalItems: count,
            itemsPerPage: limit,
            currentPage: page,
            totalPages: totalPages
        };

        res.status(200).json({
            articles: rows,
            pagination: pagination
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching articles",
            error: error.message
        });
    }
};
// 게시글 ID로 게시글 조회
exports.getArticleById = async (req, res) => {
    try {
        const id = req.params.id; // 경로 매개변수에서 게시글 ID 가져오기
        const article = await Article.findByPk(id); // Primary Key를 기반으로 DB에서 게시글 조회

        if (!article) {
            return res.status(404).send({ message: 'Article not found' });
        }

        res.status(200).send(article);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving article', error: error.message });
    }
};
