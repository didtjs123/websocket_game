import { gameStart, gameEnd } from './game.handler.js';
import { moveStageHandler } from './stage.handler.js';
import { createItemsHandler } from './item.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  21: createItemsHandler,
};

export default handlerMappings;
