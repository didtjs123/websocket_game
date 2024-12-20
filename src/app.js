import express from 'express'; // express 웹 프레임워크를 사용하기 위함
import { createServer } from 'http'; // http서버를 생성하기 위함
import initSocket from './init/socket.js'; // 소켓 실행 함수를 사용하기 위함
import { loadGameAssets } from './init/assets.js'; // 데이테이블을 읽는 함수를 사용하기 위함

// express 메서드를 동작
const app = express();
// 동작시킨 express 메서드를 http서버를 생성하는 createServer메서드 매개값에 보내어, http 서버에 express웹프레임워크를 연결시킨다.
const server = createServer(app);
// 서버 사용 포트
const PORT = 3000;

// 클라이언트 요청데이터 body의 값을 파싱하고 사용한다.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//정적파일 (html, css, js)을 서빙
app.use(express.static('public'));

// 소켓 추가
initSocket(server);

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World</h1>');
// });

// 서버 실행
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    //assets? 데이터테이블 파일을 읽는 함수
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }
});
