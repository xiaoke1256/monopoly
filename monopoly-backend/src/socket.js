
import {
    acceptPlyerApply,
    acceptInviterNotice
} from './ws/gameManageWs.js'
import { 
    listenMainMsg,
    listenDiceMsg,
    listenCashBoxModalMsg
} from "./ws/gameWs.js";

export function initWebSocket(app){
    app.ws('/ws',(ws, req)=>{
        console.log('Websocket has Connected!');
    });
    app.ws('/ws/gm/invite',acceptPlyerApply);
    app.ws('/ws/gm/invitee',acceptInviterNotice);
    
    app.ws('/ws/game/main',listenMainMsg);
    app.ws('/ws/game/dice',listenDiceMsg);
    app.ws('/ws/game/cashBoxModal',listenCashBoxModalMsg);
    
}