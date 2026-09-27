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

const createWsHandle = (wsHolder)=>{
    return  async (ws, req) => {

        console.log("connecting...")

        const game = await queryCurrentGame(req);
        const gameId = game._id;

        if(wsHolder[gameId]){
            wsHolder[gameId].push(ws);
        }else{
            wsHolder[gameId]=[ws];
        }

        console.log('ws 连接成功:', gameId);
        ws.send(`ws 连接成功:${gameId}`);


        ws.on('message', (msg) => {
            console.log('收到页面消息:', msg);
            try {
                const response = JSON.parse(msg);
                if(wsHolder[gameId]){
                    for(const toWs of wsHolder[gameId]){
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
            console.log('连接关闭 gameId:', gameId);
            if (!wsHolder[gameId]){
                console.error('该ws没有保存');
                return;
            }
            const index = wsHolder[gameId].indexOf(ws);
            if (index !== -1) {
                wsHolder[gameId].splice(index, 1);
            }else{
                console.error('该ws没有保存');
                return;
            }
            if (wsHolder[gameId].length===0){
                delete wsHolder[roomNo]
            }
            
        });
    }
}

const gameMainWs = {}

export const sendMainWsMsg = (gameId,msg) => {
    if (gameMainWs[gameId]) {
        for (const ws of gameMainWs[gameId]){
            ws.send(msg)
        }
    }
}

export const listenMainMsg = createWsHandle(gameMainWs)

const gameDiceWs = {};

export const sendDiceWsMsg = (gameId,msg) => {
    if(!gameDiceWs[gameId] ||gameDiceWs[gameId].length==0 ) {
        console.log("ws未保存");
    }
    if (gameDiceWs[gameId]) {
        for (const ws of gameDiceWs[gameId]){
            ws.send(msg)
        }
    }
}

export const listenDiceMsg = createWsHandle(gameDiceWs)
