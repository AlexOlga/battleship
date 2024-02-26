import { Games, PlayersWs } from './data';
import { KILLED, MISS, SHOT, TAttack, TGame, TPosition, TPships, TRooms, TShip } from './type';
import { generateUniqueId, randomNumber } from './utils';
import { updatePlayer, updateWinners } from './users';
import { updateRoom } from './rooms';

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
    game.currentUser=game.players[0].indexPlayer;
    startGame(game);
    sendTurn(game.currentUser, game.players);
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
      sh.isLive = true;
    });
  });
};

export const attack = (req: string) => {
  const data = JSON.parse(req) as TAttack;
  const game = Games[data.gameId];  

  if (!game) {
    console.error('Game with this ID was not found');
    return;
  }
  // выстрел не в свой ход
  if (game.currentUser !== data.indexPlayer) return;

  const player = game.players?.find((p) => p.indexPlayer !== data.indexPlayer);
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
    // определяем чей ход
    if (st === MISS) {
        game.currentUser = player.indexPlayer;
      sendTurn(player.indexPlayer, game.players);
    } else {
        game.currentUser = data.indexPlayer;
      sendTurn(data.indexPlayer, game.players);
    }
    //проверяем игру на победу
    if (st === KILLED && isWin(player)) {
      sendWin(data.indexPlayer, game.players);
      updatePlayer(data.indexPlayer);
      updateWinners();
      updateRoom();
    }
  }
};

const getResultAttack = (ships: TShip[], x: number, y: number) => {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].direction) {
      if (isShortV(ships[i].position, ships[i].length, { x, y })) {
        // short in ship[i]
        return changeStatusShip(ships[i], { x, y });
      }
    } else {
      if (isShortH(ships[i].position, ships[i].length, { x, y })) {
        // short in ship[i]
        return changeStatusShip(ships[i], { x, y });
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

const changeStatusShip = (ships: TShip, attack: TPosition) => {
  const { status, direction, position } = ships;
  if (!status) return;

  const attackP = direction ? attack.y : attack.x;
  const shipP = direction ? position.y : position.x;
  status[attackP - shipP] = true;
  const kill = isKilled(status);
  if (kill) ships.isLive = false;
  return kill ? KILLED : SHOT;
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

const isWin = (player: TPships) => {
  let win = false;
  const { ships } = player;
  let i = 0;
  while (!win && i < ships.length) {
    if (ships[i].isLive) win = true;
    i++;
  }
  return !win;
};

const sendWin = (winPlayerId: number, players: TPships[]) => {
  const data = {
    winPlayer: winPlayerId,
  };
  const response = {
    type: 'finish',
    data: JSON.stringify(data),
    id: 0,
  };
  players.forEach((p) => {
    PlayersWs[p.indexPlayer].send(JSON.stringify(response));
  });
};
export const randomAttack = (req: string) => {
  const data = JSON.parse(req);

  const newData = {
    gameId: data.gameId,
    x: randomNumber(),
    y: randomNumber(),
    indexPlayer: data.indexPlayer,
  };
  attack(JSON.stringify(newData));
};
