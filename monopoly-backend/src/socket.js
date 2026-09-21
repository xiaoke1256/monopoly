
import {
    requestGameInfoFromInvitee,
    acceptPlyerApply

} from './ws/gameManageWs.js'

export function initWebSocket(app){
    app.ws('/ws/gm/invitee/gameInfo',requestGameInfoFromInvitee);
    app.ws('/ws/gm/invite',acceptPlyerApply);
    

}