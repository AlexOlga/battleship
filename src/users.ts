import  WebSocket from 'ws';
import { Players } from "./data";
import { TPlayer } from "./type";

export const regPlayer = (ws: WebSocket, user: TPlayer) => {   
    Players.push(user);
    const response = {
        type: 'reg',
        data: JSON.stringify({
          name:  user.name,
          index: Players.length-1,
          error: false,
          errorText: '',
        }),
        id: 0,
      };
    
      ws.send(JSON.stringify(response));
    }
