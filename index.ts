import { httpServer } from './src/http_server/index';
import { wsServer, handleRequest } from './src/ws-server/index';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import { generateUniqueId } from './src/utils';
import { PlayersWs } from './src/data';
dotenv.config();

const HTTP_PORT = process.env.PORT || 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);



wsServer.on('connection', (ws: WebSocket) => {
    console.log('WebSocket connection');

    const id = generateUniqueId();
    PlayersWs[id] = ws;

    ws.on('message', (message: string) => {
        const request = JSON.parse(message);
        console.log(request);        
        handleRequest(ws, id, request);

    });

    process.on('SIGINT', () => {       
        for (const key in PlayersWs) {
            PlayersWs[key].close();
        }     
        console.log('Connection interrupted');  
            process.exit();
        })
    
});