import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

export const handleConnection = (socket, uuid) => {
  console.log(`유저 연결 성공: ${uuid} with socket ID ${socket.id}`);
  console.log(`접속 중인 유저들:`, getUsers());

  createStage(uuid);

  socket.emit('connection', [uuid]);

  socket.on('reqDataTable', () => {
    const data = getGameAssets();
    socket.emit('resDataTable', data);
  });
};

//이벤트 핸들러 함수
export const handlerEvent = (io, socket, data) => {
  // 클라이언트 버전 검증
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', {
      status: 'fail',
      message: 'client version mismatch',
    });
    return;
  }

  // 핸들러 ID에 매핑된 값(함수)로 접근
  const handler = handlerMappings[data.handlerId];

  //핸들러ID 매핑 검증
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not fount' });
    return;
  }

  // 매개 변수를 담아 핸들러 실행
  const response = handler(data.userId, data.payload, socket);

  //브로드캐스트해야 한다면
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // 소켓에게만 응답해야 한다면
  socket.emit('response', response);
};
