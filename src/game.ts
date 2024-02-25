import WebSocket from 'ws';
import { Games, PlayersWs } from './data';
import { KILLED, MISS, SHOT, TAttack, TGame, TPosition, TPships, TRooms, TShip } from './type';
import { generateUniqueId } from './utils';

export const createGame = (room: TRooms) => {
  const idGame = generateUniqueId();
  Games[idGame] = { idGame, room };
  room.roomUsers.forEach((r) => {
    const data = {
      idGame,
      idPlayer: r.index,
    };
    const response = {
      type: 'create_game',
      data: JSON.stringify(data),
      id: 0,
    };
    const ws = PlayersWs[r.index];
    ws.send(JSON.stringify(response));
  });
};

export const addShips = (req: string) => {
  const data = JSON.parse(req);
  const game = Games[data.gameId];
  if (!game.players) {
    game.players = [];
    game.players[0] = data;
  } else {
    game.players[1] = data;
  }
  if (game.players.length === 2) {
    startGame(game);
    sendTurn(game.players[0].indexPlayer, game.players);
  }
};

const startGame = (game: TGame) => {
  if (!game.players) return;

  game.players.forEach((p) => {
    const data = {
      ships: p.ships,
      currentPlayerIndex: p.indexPlayer,
    };
    const response = {
      type: 'start_game',
      data: JSON.stringify(data),
      id: 0,
    };
    const ws = PlayersWs[p.indexPlayer];
    ws.send(JSON.stringify(response));
    p.ships.forEach((sh) => {
      sh.status = Array(sh.length).fill(false);
    });
  });
};

export const attack = (ws: WebSocket, req: string) => {
  const data = JSON.parse(req) as TAttack;
  const game = Games[data.gameId];
  if (!game) {
    console.error('Game with this ID was not found');
    return;
  }

 const player = game.players?.find((p) => p.indexPlayer !== data.indexPlayer);
 //const player = game.players?.find((p) => p.indexPlayer === data.indexPlayer);
  if (player?.ships) {
    const st = getResultAttack(player?.ships, data.x, data.y);
    const resData = {
      position: {
        x: data.x,
        y: data.y,
      },
      currentPlayer: data.indexPlayer,
      status: st,
    };
    const response = {
      type: 'attack',
      data: JSON.stringify(resData),
      id: 0,
    };
    game.players?.forEach((p) => {
      PlayersWs[p.indexPlayer].send(JSON.stringify(response));
    });
    if (!game.players) return;
    if (st === MISS) {
      sendTurn(player.indexPlayer, game.players);
    } else {
      sendTurn(data.indexPlayer, game.players);
    }
  }
};

const getResultAttack = (ships: TShip[], x: number, y: number) => {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].direction) {
      if (isShortV(ships[i].position, ships[i].length, { x, y })) {
        // short in ship[i]
        return changeStatusShip(ships[i].position.y, y, ships[i].status);
      }
    } else {
      if (isShortH(ships[i].position, ships[i].length, { x, y })) {
        // short in ship[i]
        return changeStatusShip(ships[i].position.x, x, ships[i].status);
      }
    }
  }
  return MISS;
};

const isShortH = (shipP: TPosition, shipL: number, attackP: TPosition) => {
  return attackP.x >= shipP.x && attackP.x < shipP.x + shipL && attackP.y === shipP.y;
};

const isShortV = (shipP: TPosition, shipL: number, attackP: TPosition) => {
  return attackP.y >= shipP.y && attackP.y < shipP.y + shipL && attackP.x === shipP.x;
};
const changeStatusShip = (shipP: number, attackP: number, status: boolean[] | undefined) => {
  if (!status) return;
  status[attackP - shipP] = true;
  return isKilled(status) ? KILLED : SHOT;
};

const isKilled = (status: boolean[]) => {
  let kill = true;
  let i = 0;
  while (kill && i < status.length) {
    kill = status[i];
    i++;
  }

  return kill;
};

const sendTurn = (id: number, players: TPships[]) => {
  const data = {
    currentPlayer: id,
  };
  const response = {
    type: 'turn',
    data: JSON.stringify(data),
    id: 0,
  };
  players.forEach((p) => {
    PlayersWs[p.indexPlayer].send(JSON.stringify(response));
  });
};

/*
    position: { x: 1, y: 5 },
    direction: true,
    type: 'large',
    length: 3,
    status: [ true, true, true ]
  },

*/
/*
false -->
true |

true|true| true| -- yes ship


{
  type: 'attack',
  data: '{"x":2,"y":1,"gameId":9845403983585956000,"indexPlayer":216205914456715200}',
  id: 0
}
 if (
      x >= ship.position.x &&
      x < ship.position.x + ship.length &&
      y === ship.position.y
    ) {
*/
