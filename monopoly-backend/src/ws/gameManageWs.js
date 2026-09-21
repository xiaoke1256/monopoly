export const gameInfoFromInviteeWs = {};
export const acceptPlyerApplyWs = {};

/* 与受邀者连接的ws */
export const requestGameInfoFromInvitee = (ws, req) => {
    const { sessionId, roomId } = req.query;
    if (!sessionId || !roomId) {
        console.error('缺少必要参数: sessionId 或 roomId');
        ws.close(1008, '缺少必要参数');
        return;
    }
    console.log('受邀者连接成功 sessionId:', sessionId, 'roomId:', roomId);
    ws.send(`连接成功 sessionId:${sessionId},roomId:${roomId}`);
    gameInfoFromInviteeWs[sessionId] = ws;

    //向邀请者询问 GameInfo
    if (!acceptPlyerApplyWs[roomId]) {
        console.error('邀请者尚未连接 roomId:', roomId);
        ws.send(JSON.stringify({ action: 'error', message: '邀请者未连接' }));
        ws.close();
        delete gameInfoFromInviteeWs[sessionId];
        return;
    }
    acceptPlyerApplyWs[roomId].send(JSON.stringify({
        action: 'request-for-gameInfo',
        sessionId: sessionId
    }));

    ws.on('message', (msg) => {
        console.log('收到受邀者消息:', msg);
    });

    ws.on('close', () => {
        console.log('受邀者连接关闭 sessionId:', sessionId);
        delete gameInfoFromInviteeWs[sessionId];
    });
}

/** 邀请者接受玩家申请 */
export const acceptPlyerApply = (ws, req) => {
    const { roomId } = req.query;
    if (!roomId) {
        console.error('缺少必要参数: roomId');
        ws.close(1008, '缺少必要参数');
        return;
    }
    console.log('邀请者连接成功 roomId:', roomId);
    ws.send(`连接成功 roomId:${roomId}`);
    acceptPlyerApplyWs[roomId] = ws;

    ws.on('message', (msg) => {
        console.log('收到邀请者消息:', msg);
        try {
            const response = JSON.parse(msg);
            if (response.action === 'gameInfo') {
                const gameInfo = response.data.gameInfo;
                const sessionId = response.data.sessionId;
                if (gameInfoFromInviteeWs[sessionId]) {
                    gameInfoFromInviteeWs[sessionId].send(JSON.stringify({
                        action: 'gameInfo',
                        data: { gameInfo }
                    }));
                } else {
                    console.error('找不到对应的受邀者 sessionId:', sessionId);
                }
            } else {
                console.error('收到未知 action:', response.action);
            }
        } catch (e) {
            console.error('消息解析失败:', msg, e);
        }
    });

    ws.on('close', () => {
        console.log('邀请者连接关闭 roomId:', roomId);
        delete acceptPlyerApplyWs[roomId];
    });
}
