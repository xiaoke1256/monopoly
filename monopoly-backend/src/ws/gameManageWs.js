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
