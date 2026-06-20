import { Router } from 'express';
import { getAllMaps, getMapById, getDefaultMap } from '../controllers/mapController.js';

const mapRouter = new Router();

mapRouter.get('/all', getAllMaps);
mapRouter.get('/:id', getMapById);
mapRouter.get('/', getDefaultMap);

export default mapRouter;