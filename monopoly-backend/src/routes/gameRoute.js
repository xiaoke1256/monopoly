import { Router } from 'express';
import { dice,
    getCurrentGame,
    getCurrentDice,
    movePlayer,
    onArrived,
    endTurn,
    payForPropertyAndEndTurn,
    payForUpgradePropertyAndEndTurn,
    payRentAndEndTurn,
    getCurrentMap,
    getPlayerStatus,
    getMoney,
    getCurrentMessage,
    payForMessage,
    exchange,
    cancelBuyPropertyAndEndTurn,
    cancelUpgradePropertyAndEndTurn
 } from '../controllers/gameController.js';

const gameRouter = new Router();   

gameRouter.get('/dice', dice);
gameRouter.get('/current', getCurrentGame);
gameRouter.get('/player-status', getPlayerStatus);
gameRouter.get('/dice-value', getCurrentDice);
gameRouter.post('/player/:playerIndex/move', movePlayer);
gameRouter.get('/player/:playerIndex/arrived', onArrived);
gameRouter.post('/player/:playerIndex/payForProperty', payForPropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/cancelForProperty', cancelBuyPropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/payForUpgradeProperty', payForUpgradePropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/cancelUpgradeProperty',cancelUpgradePropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/payRent', payRentAndEndTurn);
gameRouter.post('/player/:playerIndex/endTurn', endTurn);
gameRouter.get('/map', getCurrentMap);
gameRouter.get('/player/:playerIndex/money', getMoney);
gameRouter.get('/player/:playerIndex/message', getCurrentMessage);
gameRouter.post('/player/:playerIndex/payForMessage', payForMessage);
gameRouter.post('/player/:playerIndex/exchange', exchange);

export default gameRouter;