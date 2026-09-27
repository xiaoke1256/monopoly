import { sendMainWsMsg, sendDiceWsMsg } from "../ws/gameWs.js";
import { getCurrentSession } from "../utils/security.js";

export const sendMsgToMain = async (req, res)=>{
    const session = await getCurrentSession(req)
    const sessionId = session.sessionId;
    const msg = JSON.stringify({...req.body,sessionId});
    sendMainWsMsg(session.gameId,msg);
    return res.json({ success:true,message: 'message send success!' });
}

export const sendStartDiceMsg = async (req, res)=>{
    const session = await getCurrentSession(req)
    const sessionId = session.sessionId;
    const msg = JSON.stringify({action:'startDice',message:'开始掷骰子',sessionId});
    console.log("准备发送消息：",msg);
    sendDiceWsMsg(session.gameId,msg);
    return res.json({ success:true,message: 'message send success!' });
}