import { Router } from 'express';
import { getValidGames,
    startExistGame,
    createGame,
    generateRoomNo,
    getGameInfoByTempRoomNo } from '../controllers/gameManageController.js';

const gameManageRouter = new Router();   

gameManageRouter.get('/validGames', getValidGames);
gameManageRouter.post('/startExistGame',startExistGame);
gameManageRouter.post('/createGame',createGame);
gameManageRouter.post('/generateRoomNo',generateRoomNo);
gameManageRouter.get('/gameInfoByTempRoomNo',getGameInfoByTempRoomNo);


export default gameManageRouter;