import { Router } from 'express';
import { getValidGames,startExistGame } from '../controllers/gameManageController.js';

const gameManageRouter = new Router();   

gameManageRouter.get('/validGames', getValidGames);
gameManageRouter.post('/startExistGame',startExistGame);


export default gameManageRouter;