export const acceptPlyerApplyWs = {};

const inviteWsCallBacks = {};

export function sendToInviter(roomNo,sessionId,msg,callBack){
    console.log("roomNo:",roomNo,"sessionId:",sessionId,"msg:",msg)
    const ws = acceptPlyerApplyWs[roomNo];
    //console.log("ws:",ws)
    inviteWsCallBacks[sessionId] = callBack;
    ws.send(msg)
}

/** 邀请者接受玩家申请 */
export const acceptPlyerApply = (ws, req) => {
    const { roomNo } = req.query;
    if (!roomNo) {
        console.error('缺少必要参数: roomNo');
        ws.close(1008, '缺少必要参数');
        return;
    }
    console.log('邀请者连接成功 roomNo:', roomNo);
    ws.send(`连接成功 roomNo:${roomNo}`);
    acceptPlyerApplyWs[roomNo] = ws;

    ws.on('message', (msg) => {
        console.log('收到邀请者消息:', msg);
        try {
            const response = JSON.parse(msg);
            const sessionId = response.sessionId;
            if (!inviteWsCallBacks[sessionId]){
                console.error("no call back function :",sessionId);
                return;
            }
            const result = inviteWsCallBacks[sessionId](response)
            if ( result && result instanceof Promise ){
                result.then((data)=>{
                    console.info("data:",data);
                    delete inviteWsCallBacks[sessionId]
                }).catch((error)=>{ 
                    console.error(error);
                    delete inviteWsCallBacks[sessionId]
                });
            }else{
                delete inviteWsCallBacks[sessionId]
            }
        } catch (e) {
            console.error('消息解析失败:', msg, e);
        }
    });

    ws.on('close', () => {
        console.log('邀请者连接关闭 roomNo:', roomNo);
        delete acceptPlyerApplyWs[roomNo];
    });
}

const acceptInviterNoticeWs = {};

const inviterWsCallBacks = {};

export function sendToInvitee(roomNo,msg,callBack){
    console.log("in sendToInvitee, roomNo:",roomNo,"msg:",msg)
    inviterWsCallBacks[roomNo] = callBack;
    console.log("acceptInviterNoticeWs[roomNo]:",acceptInviterNoticeWs[roomNo]);
    if (acceptInviterNoticeWs[roomNo]) {
        for (const ws of acceptInviterNoticeWs[roomNo]){
            ws.send(msg)
        }
    }
}

/* 用于受邀者接收邀请人通知的ws */
export const acceptInviterNotice = (ws, req) => {
    const { roomNo,sessionId } = req.query;
    if (!roomNo || !sessionId ) {
        console.error('缺少必要参数 roomNo:',roomNo,'sessionId:',sessionId);
        ws.close(1008, '缺少必要参数 roomNo:',roomNo,'sessionId:',sessionId);
        return;
    }

    if(!acceptInviterNoticeWs[roomNo]){
        acceptInviterNoticeWs[roomNo] = [ws];
    }else{
        acceptInviterNoticeWs[roomNo].push(ws);
    }
    ws.send(`连接成功 roomNo:${roomNo},sessionId:${sessionId}`);

    ws.on('message', (msg) => {
        console.log('收到邀请者消息:', msg);
        try {
            const response = JSON.parse(msg);
            if(!inviterWsCallBacks[roomNo]){
                console.error("no call back function :",roomNo);
                return;
            }
            const result = inviterWsCallBacks[roomNo](response)
            if ( result && result instanceof Promise ){
                result.then((data)=>{
                    console.info("data:",data);
                    delete inviterWsCallBacks[roomNo]
                }).catch((error)=>{ 
                    console.error(error);
                    delete inviterWsCallBacks[roomNo]
                });
            }else{
                delete inviterWsCallBacks[roomNo]
            }
        } catch (e) {
            console.error('消息解析失败:', msg, e);
        }
    });

    ws.on('close', () => {
        console.log('受邀者连接关闭 roomNo,sessionId:', roomNo,sessionId);
        if (!acceptInviterNoticeWs[roomNo]){
            console.error('该ws没有保存');
            return;
        }
        let index = acceptInviterNoticeWs[roomNo].indexOf(ws);
        if (index !== -1) {
            acceptInviterNoticeWs[roomNo].splice(index, 1);
        }else{
            console.error('该ws没有保存');
        }
    });


}
