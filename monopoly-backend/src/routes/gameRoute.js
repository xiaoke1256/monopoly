import { Router } from 'express';
import { dice,getCurrentGame,getCurrentDice,movePlayer } from '../controllers/gameController.js';

const gameRouter = new Router();   

gameRouter.get('/dice', dice);
gameRouter.get('/current', getCurrentGame);
gameRouter.get('/dice-value', getCurrentDice);
gameRouter.post('/player/:playerIndex/move', movePlayer);

export default gameRouter;