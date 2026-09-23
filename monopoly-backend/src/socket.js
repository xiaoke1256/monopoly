
import {
    acceptPlyerApply,
    acceptInviterNotice
} from './ws/gameManageWs.js'

export function initWebSocket(app){
    app.ws('/ws',(ws, req)=>{
        console.log('Websocket has Connected!');
    });
    app.ws('/ws/gm/invite',acceptPlyerApply);
    app.ws('/ws/gm/invitee',acceptInviterNotice);
    

}