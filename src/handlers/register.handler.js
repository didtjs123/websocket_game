import { v4 as uuidv4 } from 'uuid'; // v4 생성방식의 uuid
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 유저 등록
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    socket.on('event', (data) => handlerEvent(io, socket, data));
    // 접속 해제시 이벤트 처리를 위해 대기하는 메서드
    socket.on('disconnect', (socket) => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;
