import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

// socket io 를 관리하는 함수
const initSocket = (server) => {
  //socket io객체를 생성
  const io = new SocketIO();
  // 생성한 io객체의 attach 메서드에 server 매개 값을 담는다. io와 서버 연결
  io.attach(server);
  //uuid, socket id를 관리하는 핸들러
  registerHandler(io);
};

export default initSocket;
