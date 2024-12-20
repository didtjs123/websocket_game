import fs from 'fs'; //파일을 읽기 위해 사용
import path from 'path'; // 폴더의 경로를 알기 위해 사용
import { fileURLToPath } from 'url'; // 파일의 경로를 알기 위해 사용

// 전역 변수로 선언
let gameAssets = {};

// 해당 파일의 절대 경로
const __filename = fileURLToPath(import.meta.url);
// 해당 파일의 절대 경로에서 파일이름만 뺀 디렉터리 경로
const __dirname = path.dirname(__filename);
//최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../assets');

// readFileAsync? assets 폴더 내의 파일을 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  //promise를 통해 비동기 병렬도 동작
  return new Promise((resolve, reject) => {
    //readFileAsync로부터 받는filename 매개변수를 파일 이름 + 파일경로를 추가 -> fs.readFile 메서드의 매개 변수로 보낸다.
    // 콜백함수 매개변수에는 err, data가 담기는데 err가 발생하면 reject를 보낸다.
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// loadGameAssets? readFileAsync 함수를 통해 파일을 일고 반환되는 data를 gameAssets 변수에 담는 함수
export const loadGameAssets = async () => {
  try {
    // Promise.all(), 매개로 담긴 promise함수를 동작시킨다.
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message);
  }
};

// getGameAssets? 데이터테이블 값이 담긴 변수를 반환하는 함수
export const getGameAssets = () => {
  return gameAssets;
};
