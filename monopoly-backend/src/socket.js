
import {
    acceptPlyerApply,
    acceptInviterNotice
} from './ws/gameManageWs.js'
import { listenMainMsg } from "./ws/gameWs.js";

export function initWebSocket(app){
    app.ws('/ws',(ws, req)=>{
        console.log('Websocket has Connected!');
    });
    app.ws('/ws/gm/invite',acceptPlyerApply);
    app.ws('/ws/gm/invitee',acceptInviterNotice);
    
    app.ws('/ws/game/main',listenMainMsg);
}