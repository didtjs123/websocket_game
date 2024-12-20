//유저 정보를 담는 전역 변수
const users = [];

// 서버 메모리에 유저의 세션(소켓ID)을 저장
// 이때 유저는 객체 형태로 저장
// { uuid: string; socketId: string; };
export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (socketId) => {
  // 매개로 받은 socketId가 등록된 유저 정보에 있다면 그 인덱스를 반환한다. 없다면 -1을 반환한다.
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    //해당 인덱스의 요소를 삭제하고 그 삭제된 데이터를 반환한다.
    return users.splice(index, 1)[0];
  }
};

// 전체 유저 조회
export const getUsers = () => {
  return users;
};
