import  WebSocket, { WebSocketServer } from 'ws';
import { TRequest } from '../type';
import { regPlayer } from '../users';
import { createRoom, updateRoom} from '../rooms';
import { Players } from '../data';

const WSPORT = 3000;

export const wsServer = new WebSocketServer({
  port: WSPORT,
});

export const handleRequest = (ws: WebSocket, index:number, req: TRequest) => {
  switch (req.type) {
    case 'reg':  
    const player=JSON.parse(req.data);  
      regPlayer(ws, index, player );
      console.log(' Players', Players)
      break;
    case 'create_room':
      createRoom(); 
     updateRoom();
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