import crypto from 'crypto';
import { PlayersWs } from './data';
import { TRequest } from './type';


export const generateUniqueId = () => {
    const id = crypto.randomBytes(8).toString('hex');
    return parseInt(id, 16);
}


export const sendALL = (response: TRequest ) => {
    for (const key in PlayersWs) {
        PlayersWs[key].send(JSON.stringify(response));
    }

}

export const randomNumber = () => {
    return Math.floor(Math.random() * 10);
}
