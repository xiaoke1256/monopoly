import { Router } from 'express';
import { dice,getCurrentGame,getCurrentDice,movePlayer,onArrived } from '../controllers/gameController.js';

const gameRouter = new Router();   

gameRouter.get('/dice', dice);
gameRouter.get('/current', getCurrentGame);
gameRouter.get('/dice-value', getCurrentDice);
gameRouter.post('/player/:playerIndex/move', movePlayer);
gameRouter.get('/player/:playerIndex/arrived', onArrived);

export default gameRouter;