import { Router } from 'express';
import mapRouter from './routes/mapRoute.js';

const webRouter = new Router();

webRouter.get('/', (req, res) => {
  res.json({ message: 'Monopoly Server Running' });
});

webRouter.use('/map', mapRouter);

export default webRouter;