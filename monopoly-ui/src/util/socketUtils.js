
import { isValidJSON } from './jsonUtils'

export const createWebSocket = (uri,reciver) => {

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const token = localStorage . getItem ( 'token' );
    const webSocket = new WebSocket(`${protocol}//${location.host}${uri}?token=${token}`);
    webSocket.onopen=()=>{
        console.log('WebSocket connected!');
    };
    webSocket.onmessage = async (event) => {
        console.log('Received message:', event.data);
        if(!isValidJSON(event.data)){
            return;
        }
        const data = JSON.parse(event.data);
        const sessionId = localStorage.getItem('sessionId');
        if (data.sessionId === sessionId) {
            console.warn('收到了自己发给自己的消息');
            return;
        }
        if(reciver){
            reciver(data)
        }
    
    };
    webSocket.onclose = () => {
        console.log('WebSocket closed!');
    };
    webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    return webSocket;
}

export const closeWebSocket = (webSocket)=>{
    try{
        webSocket.close();
    }catch(e){
        console.error('error!',e);
    }
}

export const send = (webSocket,data) => {
    // send 之前检查 webSocket 状态
    if (!webSocket || webSocket.readyState === WebSocket.CLOSED  || webSocket.readyState === WebSocket.CLOSING) {
        //先打日志，以后想办法实现重连机制
        console.warn(`WebSocket is ${webSocket?.readyState}.`);
    }
    const sessionId = localStorage.getItem('sessionId');
    webSocket.send(JSON.stringify({...data,sessionId}))
}