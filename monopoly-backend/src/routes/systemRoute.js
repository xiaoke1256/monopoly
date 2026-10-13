import { Router } from 'express';
import { saveLog } from '../controllers/systemController.js';

const logsRouter = new Router();   

logsRouter.post('/log', saveLog);

export default logsRouter;
