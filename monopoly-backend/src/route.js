import { Router } from 'express';
import mapRouter from './routes/mapRoute.js';
import gameRouter from './routes/gameRoute.js';

const webRouter = new Router();

webRouter.get('/', (req, res) => {
  res.json({ message: 'Monopoly Server Running' });
});

webRouter.use('/map', mapRouter);
webRouter.use('/game', gameRouter);

export default webRouter;