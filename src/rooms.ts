import { generateUniqueId } from './utils';
import { PlayersWs, Rooms } from './data';

export const createRoom = () => {
    Rooms.push({
        roomId: generateUniqueId(),
        roomUsers: []
    });

}

export const updateRoom = () => {
    const data = Rooms.map((r) => {
        if (r.roomUsers.length < 2) return r
    })
    console.log('data room', data);
    const response =
    {
        type: "update_room",
        data: JSON.stringify(data),
        id: 0,
    };
    for (const key in PlayersWs) {
        PlayersWs[key].send(JSON.stringify(response));
    }



}
