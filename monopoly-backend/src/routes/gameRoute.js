import { Router } from 'express';
import { dice,
    getCurrentGame,
    getCurrentDice,
    movePlayer,
    onArrived,
    endTurn,
    payForPropertyAndEndTurn,
    payForUpgradePropertyAndEndTurn,
    getCurrentMap,
    getPlayerStatus } from '../controllers/gameController.js';

const gameRouter = new Router();   

gameRouter.get('/dice', dice);
gameRouter.get('/current', getCurrentGame);
gameRouter.get('/player-status', getPlayerStatus);
gameRouter.get('/dice-value', getCurrentDice);
gameRouter.post('/player/:playerIndex/move', movePlayer);
gameRouter.get('/player/:playerIndex/arrived', onArrived);
gameRouter.post('/player/:playerIndex/payForProperty', payForPropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/payForUpgradeProperty', payForUpgradePropertyAndEndTurn);
gameRouter.post('/player/:playerIndex/endTurn', endTurn);
gameRouter.get('/map', getCurrentMap);

export default gameRouter;