import { httpServer } from './src/http_server/index';
import {wsServer,  handleRequest} from './src/ws-server/index';
import  WebSocket from 'ws';

import dotenv from 'dotenv';
dotenv.config();

const HTTP_PORT = process.env.PORT || 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


wsServer.on('connection', (ws: WebSocket) => {
    console.log('WebSocket connection established');
  
    ws.on('message', (message: string) => {
      const request = JSON.parse(message);
      console.log(request);
      handleRequest (ws, request);
      
    });
  
    ws.on('close', () => {
      console.log('Connection interrupted');
    });
  });