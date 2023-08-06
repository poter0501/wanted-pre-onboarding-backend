## 지원자 성명
- 이도영
## 애플리케이션의 실행 방법 (엔드포인트 호출 방법 포함)
## 데이터베이스 테이블 구조
## 구현한 API의 동작을 촬영한 데모 영상 링크
## 구현 방법 및 이유에 대한 간략한 설명
## API 명세(request/response 포함)
### [1. 사용자 정보](#사용자-정보)
-  [회원 가입](#회원-가입)
-  [로그인](#로그인)
### [2. 게시글](#게시글)
-  [게시글 생성](#게시글-생성)
-  [게시글 목록 조회](#게시글-목록-조회)
-  [특정 게시글 조회](#특정-게시글-조회)
-  [특정 게시글 수정](#특정-게시글-수정)
-  [특정 게시글 삭제](#특정-게시글-삭제)


### 사용자 정보
#### 회원 가입
- URL: 'user/register'
- Method: 'POST'
- Request: 
    ``` Json
    // Body
    {
        "email": "사용자 이메일",
        "password": "사용자 비밀번호"
    }
    ```
- Response:
    ``` Json
    // Success, state code: 201 Created
    {
        "message": "User registered successfully",
        "user": {
        "id": 1, // unique userId
        "email": "사용자 이메일",
        "password": "암호화된 비밀번호",
        "updatedAt": "갱신일자",
        "createdAt": "생성일자"
        }
    }
    // Fail, state code: 400 Bad Request
    // When email, password validation was failed
    {
        "message": "Invalid email format"
    }
    {
        "message": "Invalid password format"
    }
    // Fail, state code: 400 Bad Request
    // When email was already exist
    {
        "message": "Email already in use"
    }
    ```
#### 로그인
- URL: 'user/login'
- Method: 'POST'
- Request: 
    ``` Json
    // Body
    {
        "email": "사용자 이메일",
        "password": "사용자 비밀번호"
    }
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "message": "Logged in successfully",
        "token": "<token>"
    }
    // Fail, state code: 400 Bad Request
    // When email, password validation was failed
    {
        "message": "Invalid email format"
    }
    {
        "message": "Invalid password format"
    }
    // Fail, state code: 401 Unauthorized
    {
        "message": "Incorrect email or password"
    }
    ```

### 게시글
#### 게시글 생성
- URL: 'article/post'
- Method: 'POST'
- Request: 
    ``` Json
    // Header
    {
        "Authorization": "Bearer <token>"
    }
    // Body
    {
        "content": "게시글 내용"
     }
    ```
- Response:
    ``` Json
    // Success, state code: 201 Created
    {
        "message": "Article created successfully",
        "article": {
            "id": 1, //unique articleId
            "author": 1, //unique userId
            "content": "게시글 내용",
            "updatedAt": "갱신 일자",
            "createdAt": "생성 일자"
            }
    }
    // Fail, state code: 500
    {
        "message": "Error creating article",
        "error": "error"
    }
    ```
#### 게시글 목록 조회
- URL: 'article/list'
- Method: 'GET'
- Request: 
    ``` Json
    'article/list?page=3&limit=5'
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "articles": [
            {
                "id": 10, // 게시글 articleId
                "author": "1", // 작성자 userId
                "content": "게시글 내용",
                "createdAt": "생성 일자",
                "updatedAt": "갱신 일자"
            },
            // ... 
        ],
        "pagination": {
            "totalItems": 20, // all items
            "itemsPerPage": 5, // limit
            "currentPage": 3,  // current page
            "totalPages": 4 // total pages
        }
    }
    // Fail, state code: 500
    {
        "message": "Error fetching articles",
        "error": "error"
    }
    ```
#### 특정 게시글 목록 조회
- URL: 'article/:id'
- Method: 'GET'
- Request: 
    ``` Json
    // ex)
    'article/11' // 게시글 ID(articleId)
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "id": 13, // 게시글 Id(articleId)
        "author": "30", // 작성자 Id(userId)
        "content": "게시글 내용",
        "createdAt": "생성 일자",
        "updatedAt": "갱신 일자"
    }
    // Fail, state code: 500
    {
        "message": "Error retrieving articles",
        "error": "error"
    }
    ```


#### 특정 게시글 목록 수정
- URL: 'article/:id'
- Method: 'PUT'
- Request: 
    ``` Json
    // Header
    {
        "Authorization": "Bearer <token>"
    }
    // Body
    {
        "content": "게시글 내용"
     }
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "message": "Article updated successfully",
        "article": {
            "id": 12, // 게시글 Id
            "author": "1", // 작성자 Id
            "content": "수정된 게시글 내용",
            "createdAt": "생성 일자",
            "updatedAt": "갱신 일자"
        }
    }
    // Fail, state code: 404 Not Found
    {
        "message": "Article not found"
    }
    // Fail, state code: 403 Forbidden
    {
        "message": "You are not authorized to edit this article"
    }
    // Fail, state code: 500
    {
        "message": "Error updating article",
        "error": "error"
    }
    ```