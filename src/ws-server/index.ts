import  { WebSocketServer } from 'ws';

const WSPORT = 3000;

export const wsServer = new WebSocketServer({
  port: WSPORT,
});
/*
wsServer.on('connection', (ws: WebSocket) => {
  console.log('WebSocket connection established');

  ws.on('message', (message: string) => {
    const request = JSON.parse(message);
 console.log(request)
  });

  ws.on('close', () => {
    console.log('Connection interrupted');
  });
});
*/