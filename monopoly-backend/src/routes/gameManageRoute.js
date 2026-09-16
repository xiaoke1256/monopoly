import { Router } from 'express';
import { getValidGames } from '../controllers/gameManageController.js';

const gameManageRouter = new Router();   

gameManageRouter.get('/validGames', getValidGames);

export default gameManageRouter;