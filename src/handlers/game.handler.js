import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  // stages 배열에서 0번째 = 첫번째 스테이지
  //편의로 payload.timestamp을 서버에 담기로 한다. 검증 추가하여 수정필요
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage:', getStage(uuid));

  return { status: 'success' };
};
export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  stages.sort((a, b) => a.id - b.id);
  const currentState = stages[stages.length - 1];

  // 현재 스테이지 정보 검증
  // 배열 요소로 도출된 최신 스테이지 vs 실제 클라이언트 응답데이터 비교
  if (currentState.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // 스테이지 정보 가져오기
  const { stages: assetsStages } = getGameAssets();
  const currentStageConfig = assetsStages.data.find(
    (stage) => stage.id === currentState.id,
  );

  if (!currentStageConfig) {
    return { status: 'fail', message: 'Stage configuration not found' };
  }

  // 초당 스코어와 경과 시간 계산
  const { scorePerSecond, score: stageMaxScore } = currentStageConfig;
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentState.timestamp) / 1000; // 초 단위 경과 시간

  // 기준 점수 계산: 경과 시간 * 초당 스코어
  const calculatedScore = elapsedTime * scorePerSecond;

  // 게임 종료 시 총 점수
  const totalScore = stageMaxScore + calculatedScore;

  // **5초 동안의 오차 범위 계산** -> 초당 스코어 * 5
  const toleranceScore = scorePerSecond * 5;

  //점수와 타임스탬프 검증
  //오차범위 초당 스코어 * 5
  //abs메서드는 정수의 절대값을 반환한다.
  if (Math.abs(score - totalScore) > toleranceScore) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  return { status: 'success', message: 'Game ended', score };
  // DB에 저장한다고 가정을한다면
  // 저장
  // setResult(userId, score, timestamp)
};
