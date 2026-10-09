import { Router } from 'express';
import { dice,
    getCurrentGame,
    getCurrentRoomNo,
    getCurrentDice,
    movePlayer,
    getPlayers,
    onArrived,
    endTurn,
    payForPropertyAndEndTurn,
    payForUpgradePropertyAndEndTurn,
    getPayRentEvent,
    payRentAndEndTurn,
    getCurrentMap,
    getPlayerStatus,
    getMoney,
    getCurrentMessage,
    getCurrentQuestion,
    getCurrentChance,
    payForMessage,
    consumeMessage,
    consumeChance,
    answerQuestion,
    payForSecurityCompany,
    cancelSecurityCompany,
    exchange,
    cancelBuyPropertyAndEndTurn,
    cancelUpgradePropertyAndEndTurn,
    getBankruptInfo,
    getBankruptInfos,
    bankrupt,
    getFinalPlayer,
    hasRoleOperPermission,
    getPlayerInfo,
    getCurrentPlayerIndex
 } from '../controllers/gameController.js';

import { sendMsgToMain,
    sendStartDiceMsg
 } from '../controllers/gameWsController.js';

const gameRouter = new Router();   

gameRouter.post('/dice', dice);
gameRouter.get('/current', getCurrentGame);
gameRouter.get('/current/room-no', getCurrentRoomNo);
gameRouter.get('/player-status', getPlayerStatus);
gameRouter.get('/dice-value', getCurrentDice);
gameRouter.get('/hasRolePermission', hasRoleOperPermission);

gameRouter.get('/players',getPlayers);
gameRouter.get('/players/currentIndex',getCurrentPlayerIndex);
gameRouter.post('/player/:playerIndex/move', movePlayer);
gameRouter.get('/player/:playerIndex/arrived', onArrived);
gameRouter.post('/player/:playerIndex/payForProperty', payForPropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/cancelForProperty', cancelBuyPropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/payForUpgradeProperty', payForUpgradePropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/cancelUpgradeProperty',cancelUpgradePropertyAndEndTurn);
gameRouter.get('/player/:playerIndex/payRentEvent',getPayRentEvent);
gameRouter.post('/player/:playerIndex/payRent', payRentAndEndTurn);
gameRouter.post('/player/:playerIndex/endTurn', endTurn);
gameRouter.post('/player/:playerIndex/payForSecurityCompany', payForSecurityCompany);
gameRouter.post('/player/:playerIndex/cancelSecurityCompany',cancelSecurityCompany);
gameRouter.get('/map', getCurrentMap);
gameRouter.get('/player/:playerIndex/money', getMoney);
gameRouter.get('/player/:playerIndex/message', getCurrentMessage);
gameRouter.get('/player/:playerIndex/question', getCurrentQuestion);
gameRouter.get('/player/:playerIndex/chance', getCurrentChance);
gameRouter.post('/player/:playerIndex/payForMessage', payForMessage);
gameRouter.post('/player/:playerIndex/consumeMessage', consumeMessage);
gameRouter.post('/player/:playerIndex/consumeChance',consumeChance);
gameRouter.post('/player/:playerIndex/answerQuestion', answerQuestion);
gameRouter.post('/player/:playerIndex/exchange', exchange);
gameRouter.get('/player/:playerIndex/bankrupt',getBankruptInfo);
gameRouter.get('/bankrupt-infos',getBankruptInfos);
gameRouter.post('/player/:playerIndex/bankrupt', bankrupt);
gameRouter.get('/player/final', getFinalPlayer);

gameRouter.get('/player/:playerIndex',getPlayerInfo);

//以下与 websocket有关
gameRouter.post('/ws/sendToMain', sendMsgToMain);
gameRouter.post('/ws/sendStartDice', sendStartDiceMsg);


export default gameRouter;