import { Router } from 'express';
import { getValidGames,
    startExistGame,
    createGame,
    generateRoomNo } from '../controllers/gameManageController.js';

const gameManageRouter = new Router();   

gameManageRouter.get('/validGames', getValidGames);
gameManageRouter.post('/startExistGame',startExistGame);
gameManageRouter.post('/createGame',createGame);
gameManageRouter.post('/generateRoomNo',generateRoomNo);


export default gameManageRouter;