import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

// 전역 변수 선언
let userId = null;

socket.on('response', (data) => {
  console.log(data);
});

// 서버와 연결 시, uuid와 데이터테이블을 로드한다.
socket.on('connection', async (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

// 데이터 테이블 요청 함수
const loadData = async () => {
  return new Promise((resolve, reject) => {
    socket.emit('reqDataTable'); // 서버에 데이터 요청

    socket.on('resDataTable', (data) => {
      if (data) {
        console.log('Received data table');
        resolve(data); // 전체 데이터를 resolve
      } else {
        reject('Failed to load data table'); // 데이터가 없으면 reject
      }
    });
  });
};

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent, loadData };
