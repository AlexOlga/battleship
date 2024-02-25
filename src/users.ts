import  WebSocket from 'ws';
import { Players } from "./data";
import { TPlayer } from "./type";
import { sendALL } from './utils';

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

  export const updateWinners = () =>{
    const data = Players.map((p)=> {
        const {name, wins} = p;
        return  {
            name,
            wins
        }   
    }
  );
  const response ={
    type: "update_winners",
    data: JSON.stringify(data),
    id: 0,
  }
  sendALL(response);
}
  
  
  