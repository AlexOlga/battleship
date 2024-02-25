import  WebSocket from 'ws';
import { Players } from "./data";
import { TPlayer } from "./type";

const isPlayerExis=(player:TPlayer)=>{
    const {name}=player
    return !!Players.find((pl) => pl.name === name );
}

export const regPlayer = (ws: WebSocket,index:number, player: TPlayer) => {   
    let data;  
    if (!isPlayerExis(player)) {
        player.id = index;
        player.wins = 0;
        Players.push(player);
        data = {
            name:  player.name,
            index: index,
            error: false,
            errorText: '',
        }
    } else {
        data = {
            name:  '',
            index: -1,
            error: true,
            errorText: 'a player with the same name already exists',
        }

    }
   
    const response = {
        type: 'reg',
        data: JSON.stringify(data),
        id: 0,
      };
    
      ws.send(JSON.stringify(response));
    }


  export const  updatePlayer = (id: number) =>{
   const player = Players.find((pl) => pl.id === id );
   if (player) player.wins ++
  }