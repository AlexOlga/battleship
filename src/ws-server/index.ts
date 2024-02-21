import  WebSocket, { WebSocketServer } from 'ws';
import { TRequest } from '../type';

const WSPORT = 3000;

export const wsServer = new WebSocketServer({
  port: WSPORT,
});

export const handleRequest = (ws: WebSocket, req: TRequest) => {
  switch (req.type) {
    case 'reg':
      // regPlayer(ws, req.data);
      break;
    case 'create_room':
      // createRoom(ws, req.data);
      break;
    case 'add_user_to_room':
      // addUseerRoom(ws, req.data);
      break;
    case 'add_ships':
      // addShips(ws, req.data);
      break;
    case 'attack':
      // attack(ws, req.data);
      break;
    case 'randomAttack':
      // randomAttack(ws, req.data);
      break;
  }
};