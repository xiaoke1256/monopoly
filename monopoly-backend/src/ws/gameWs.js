import { getCurrentSession } from "../utils/security.js";
import Game from '../models/Game.js';

const queryCurrentGame = async (req)=> {
    const session = await getCurrentSession(req)

    if(!session.gameId){
        throw new Error("还未选择游戏");
        //return res.status(400).json({ message:'未选择游戏.' });
    }

    const game = await Game.findById(session.gameId);
    if (!game) {
        throw new Error("cannot find the game.");
    }
    return game;
}

const gameMainWs = {}

export const sendMainWsMsg = (gameId,msg) => {
    if (gameMainWs[gameId]) {
        for (const ws of gameMainWs[gameId]){
            ws.send(msg)
        }
    }
}

export const listenMainMsg = async (ws, req) => {

    console.log("connecting...")

    const game = await queryCurrentGame(req);
    const gameId = game._id;

    if(gameMainWs[gameId]){
        gameMainWs[gameId].push(ws);
    }else{
        gameMainWs[gameId]=[ws];
    }

    console.log('main ws 连接成功:', gameId);
    ws.send(`main ws 连接成功:${gameId}`);


    ws.on('message', (msg) => {
        console.log('收到Main页面消息:', msg);
        try {
            const response = JSON.parse(msg);
            if(gameMainWs[gameId]){
                for(const toWs of gameMainWs[gameId]){
                    if(toWs===ws){
                        //防止自己发给自己，引起死循环
                        console.log("跳过自己发给自己。")
                        continue;
                    }
                    toWs.send(msg);
                }
            }
            
        } catch (e) {
            console.error('消息解析失败:', msg, e);
        }

    });

    ws.on('close', () => {
        console.log('连接关闭 roomNo:', roomNo);
        
    });
}