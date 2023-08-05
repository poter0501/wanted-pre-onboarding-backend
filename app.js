require('dotenv').config();

const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute')
const port = 3000;
const db = require('./config/database');
const User = require('./models/user');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json())
app.use('/user', userRoute)

// DB sync
// 만약 DB의 스키마가 변경되었다면,
// db.sync({ force: true }) 옵션을 줘서 서버 재시작시 테이블을 삭제하고 재생성하도록 설정 필요
// 유의사항으로 기존의 데이터가 다 삭제될수 있다.
db.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Error creating database tables:', error);
  });

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
