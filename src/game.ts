import { PlayersWs } from "./data";
import { TRooms } from "./type"
import { generateUniqueId } from "./utils";
type TShip={
    position: {
        x: number,
        y: number,
    },
    direction: boolean,
    length: number,
    type: "small"|"medium"|"large"|"huge",
}
type TPships ={
    indexPlayer: number,
    ships: TShip[] 
};

type TGame = {
    idGame: number,
    room: TRooms,
    players?:TPships[]
   /* player1?:{
        indexPlayer: number,
        ships: TShip[] 
    }
    player2?:{
        indexPlayer: number,
        ships: TShip[] 
    }*/

}
type TGames = {
    [key: number]: TGame;
};

const Games: TGames = {};

export const createGame = (room: TRooms) => {
    const idGame = generateUniqueId();
    Games[idGame] = { idGame, room }
    room.roomUsers.forEach((r)=>{
        const data = {
            idGame,
            idPlayer: r.index
        };
        const response =
        {
            type: "create_game",
            data: JSON.stringify(data),
            id: 0
        }
        const ws = PlayersWs[r.index];
        ws.send(JSON.stringify(response));

    })
}


export const addShips=( req:string)=>{

const data = JSON.parse(req);
const game =  Games[data.gameId];
if (!game.players) {
    game.players=[]
    game.players[0]=data}
else {
    game.players[1]=data
}
 if (game.players.length ===2) {
    startGame(game);
 }

};

const  startGame = (game: TGame) =>{
    if (! game.players) return;

    game.players.forEach((p)=>{
        const data = {
            ships: p.ships,
            currentPlayerIndex: p.indexPlayer
        };
        const response =
        {
            type: "start_game",
            data: JSON.stringify(data),
            id: 0
        }
        const ws = PlayersWs[p.indexPlayer];
        ws.send(JSON.stringify(response));

    })

}


