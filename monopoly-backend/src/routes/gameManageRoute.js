import { Router } from 'express';
import { getValidGames,
    startExistGame,
    createGame } from '../controllers/gameManageController.js';

const gameManageRouter = new Router();   

gameManageRouter.get('/validGames', getValidGames);
gameManageRouter.post('/startExistGame',startExistGame);
gameManageRouter.post('/createGame',createGame);


export default gameManageRouter;