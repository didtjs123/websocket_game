import { sendEvent, loadData } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stagesData = null; // 스테이지 데이터 초기 상태
  itemsData = null;
  currentStageIndex = 0; // 현재 스테이지
  // stageData = [
  //   { id: 1000, score: 0, scorePerSecond: 1 },
  //   { id: 1001, score: 10, scorePerSecond: 2 },
  //   { id: 1002, score: 20, scorePerSecond: 4 },
  //   { id: 1003, score: 30, scorePerSecond: 8 },
  //   { id: 1004, score: 40, scorePerSecond: 16 },
  //   { id: 1005, score: 50, scorePerSecond: 32 },
  //   { id: 1006, score: 60, scorePerSecond: 64 },
  // ];

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    // 데이터테이블 로드
    this.loadData();
  }

  async loadData() {
    try {
      const data = await loadData(); // 서버에서 데이터 로드
      console.log('data:', data);
      const { stages, items } = data;
      this.stagesData = stages;
      this.itemsData = items;
    } catch (error) {
      console.error('Failed to load stage data:', error);
    }
  }

  update(deltaTime) {
    // 데이터가 아직 로드되지 않았다면 스킵
    if (!this.stagesData) {
      console.log('Stage data not loaded yet.');
      return;
    }

    const currentStage = this.stagesData.data[this.currentStageIndex];
    const nextStage = this.stagesData.data[this.currentStageIndex + 1];

    // 현재 스테이지의 초당 점수 증가량 적용
    this.score += deltaTime * (currentStage.scorePerSecond / 1000);

    // 다음 스테이지로 넘어가는 조건 확인
    if (nextStage && this.score >= nextStage.score && this.stageChange) {
      this.stageChange = false;
      console.log('currentStage:', currentStage.id);
      sendEvent(11, {
        currentStage: currentStage.id,
        targetStage: nextStage.id, // 다음 스테이지 ID
        timestamp: Date.now(), // 현재 시간
      });
      this.currentStageIndex++; // 다음 스테이지로 이동
      this.stageChange = true; // 다시 전환 가능하도록 초기화
    }
    return this.currentStageIndex;
  }

  getItem(itemId) {
    // 데이터가 아직 로드되지 않았다면 스킵
    if (!this.itemsData) {
      console.log('item data not loaded yet.');
      return;
    }
    this.score += 1;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
