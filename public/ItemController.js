import Item from './Item.js';
import { loadData } from './Socket.js';
import { sendEvent } from './Socket.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.CurrentStageId = sendEvent(21);
    this.loadGameData(); // 데이터 로드

    this.setNextItemTime();
  }

  async loadGameData() {
    const data = await loadData(); // 데이터 로드
    this.itemUnlockData = data.itemUnlocks.data;
    this.itemsData = data.items.data;
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(
      this.INTERVAL_MIN,
      this.INTERVAL_MAX,
    );
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    const index = this.getRandomNumber(0, this.itemImages.length - 1);
    const itemInfo = this.itemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(
        collidedItem.x,
        collidedItem.y,
        collidedItem.width,
        collidedItem.height,
      );
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
