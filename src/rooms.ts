import { generateUniqueId } from './utils';
import { Players, PlayersWs, Rooms } from './data';
import { TPlayer, TRooms } from './type';
import { createGame } from './game';

export const createRoom = () => {
    Rooms.push({
        roomId: generateUniqueId(),
        roomUsers: []
    });

}
export const getResponseUpdateRooms = () => {
    const data = Rooms.map((r) => {
        if (r.roomUsers.length < 2) return r
    })
    
    const response =
    {
        type: "update_room",
        data: JSON.stringify(data),
        id: 0,
    };
    return response
}
export const updateRoom = () => {
    const response = getResponseUpdateRooms()
    for (const key in PlayersWs) {
        PlayersWs[key].send(JSON.stringify(response));
    }
}

const isUserinRoom = (room: TRooms, player: TPlayer) => {
    return !!room.roomUsers.find((us) => us.index === player.id);
}

export const addUseerRoom = (id: number, data: string) => {
    const { indexRoom } = JSON.parse(data)   
    const room = Rooms.find(r => r.roomId === indexRoom);
    const player = Players.find(p => p.id === id);

    if (room && player && !isUserinRoom(room, player)) {
        room.roomUsers.push({
            name: player.name,
            index: id,
        })
    }
    if (room && room.roomUsers.length === 2) {
        createGame(room);
    }
}