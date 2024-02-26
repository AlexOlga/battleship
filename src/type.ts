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
  wins: number;
};
export type TPlayerInRoom = {
  name: string;
  index: number;
};

export type TRooms = {
  roomId: number;
  roomUsers: TPlayerInRoom[];  
};

export type TPlayersWs = {
  [key: number]: WebSocket;
};
/*types game */
export type TShip = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  status?:boolean[];
  isLive?: boolean;
};
export type TPships = {
  indexPlayer: number;
  ships: TShip[];
};

export type TGame = {
  idGame: number;
  room: TRooms;
  players?: TPships[];
  currentUser?: number;
};
export type TGames = {
  [key: number]: TGame;
};
export type TAttack ={
    x: number;
    y: number;
    gameId: number;
    indexPlayer: number;
}

export type  TPosition = {
    x: number;
    y: number
}

export const MISS ="miss";
export const KILLED="killed";
export const SHOT="shot";