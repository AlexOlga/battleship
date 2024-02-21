import WebSocket from 'ws';
export type TRequest = {
    type: string;
    data: string;
    id: number;
};

export type TPlayer = {
    id?: number;
    name: string;
    password: string;
}
export type TPlayerInRoom =
    {
        name: string,
        index: number,
    }

export type TRooms = {
    roomId: number,
    roomUsers: TPlayerInRoom[]
}

export type TPlayersWs = {
    [key: number]: WebSocket;
};