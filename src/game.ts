import { PlayersWs } from "./data";
import { TRooms } from "./type"
import { generateUniqueId } from "./utils";

type TGame = {
    idGame: number,
    room: TRooms
}
type TGames = {
    [key: number]: TGame;
};

const Games: TGames = {};

export const createGame = (room: TRooms, id: number) => {
    const idGame = generateUniqueId();
    const ws1 = PlayersWs[room.roomUsers[0].index];
    const ws2 = PlayersWs[room.roomUsers[1].index]

    Games[idGame] = { idGame, room }
    const data = {
        idGame,
        idPlayer: id
    };
    const response =
    {
        type: "create_game",
        data: JSON.stringify(data),
        id: 0
    }
    ws1.send(JSON.stringify(response));
    ws2.send(JSON.stringify(response));
}
