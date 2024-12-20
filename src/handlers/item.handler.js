import { getStage } from '../models/stage.model.js';

export const createItemsHandler = (userId, payload, socket) => {
  let currentStates = getStage(userId);
  if (!currentStates) {
    return { status: 'fail', message: 'No statges found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStates.sort((a, b) => a.id - b.id);
  const currentState = currentStates[currentStates.length - 1];
  socket.emit('createItem', currentState);
};
