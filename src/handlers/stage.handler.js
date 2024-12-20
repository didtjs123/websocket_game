import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보들
  let currentStates = getStage(userId);
  if (!currentStates.length) {
    return { status: 'fail', message: 'No statges found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStates.sort((a, b) => a.id - b.id);
  const currentState = currentStates[currentStates.length - 1];
  // 현재 스테이지 정보 검증
  // 배열 요소로 도출된 최신 스테이지 vs 실제 클라이언트 응답데이터 비교
  if (currentState.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // 유저 현재 스테이지와 일치하는 스테이지 데이터테이블 가져오기
  const { stages } = getGameAssets();
  const currentStageConfig = stages.data.find(
    (stage) => stage.id === currentState.id,
  );

  if (!currentStageConfig) {
    return { status: 'fail', message: 'Stage configuration not found' };
  }

  // 초당 스코어와 경과 시간 계산
  const getTargeStageData = (stageId) => {
    const { stages } = getGameAssets();
    const stageData = stages.data.find((stage) => stage.id === stageId);
    return stageData;
  };
  const { score: targetStageScore } = getTargeStageData(payload.targetStage);
  const { scorePerSecond } = currentStageConfig;

  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentState.timestamp) / 1000; // 초 단위 경과 시간
  // 스테이지 사이 간 얻는 점수(경과 시간 * 초당 스코어) + 이전 스테이지 스코어 :
  const calculatedScore =
    elapsedTime * scorePerSecond + currentStageConfig.score;

  // **5초 동안의 오차 범위 계산** -> 초당 스코어 * 5
  const toleranceScore = scorePerSecond * 5;

  // 검증 로직: 오차범위 내에 있는지 확인
  if (
    calculatedScore < targetStageScore - toleranceScore ||
    calculatedScore > targetStageScore + toleranceScore
  ) {
    return {
      status: 'fail',
      message: `Invalid score.`,
    };
  }

  // targetStage 대한 검증 <- 게임에셋에 존재하는가?
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);

  return { status: 'moveStage success', currentState };
};
