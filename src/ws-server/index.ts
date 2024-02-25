import WebSocket, { WebSocketServer } from 'ws';
import { TRequest } from '../type';
import { regPlayer } from '../users';
import { addUseerRoom, createRoom, getResponseUpdateRooms, updateRoom } from '../rooms';
import { addShips, attack, randomAttack } from '../game';

const WSPORT = 3000;

export const wsServer = new WebSocketServer({
  port: WSPORT,
});

export const handleRequest = (ws: WebSocket, index: number, req: TRequest) => {
  switch (req.type) {
    case 'reg':
      const player = JSON.parse(req.data);
      regPlayer(ws, index, player);

      ws.send(JSON.stringify(getResponseUpdateRooms()));

      break;
    case 'create_room':
      createRoom();
      updateRoom();
      break;
    case 'add_user_to_room':
      addUseerRoom(index, req.data);
      updateRoom();
      break;
    case 'add_ships':
      addShips(req.data);
      break;
    case 'attack':
      attack(req.data);
      break;
    case 'randomAttack':
      randomAttack(req.data);
      break;
  }
};
