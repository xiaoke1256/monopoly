import { Router } from 'express';
import mapRouter from './routes/mapRoute.js';
import gameRouter from './routes/gameRoute.js';
import userRouter from './routes/userRoute.js';

const webRouter = new Router();

webRouter.get('/', (req, res) => {
  res.json({ message: 'Monopoly Server Running' });
});

webRouter.use('/map', mapRouter);
webRouter.use('/game', gameRouter);
webRouter.use('/user', userRouter);

export default webRouter;