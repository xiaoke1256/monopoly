import { Router } from 'express';
import { dice,getCurrentGame } from '../controllers/gameController.js';

const gameRouter = new Router();   

gameRouter.get('/dice', dice);
gameRouter.get('/current', getCurrentGame);

export default gameRouter;