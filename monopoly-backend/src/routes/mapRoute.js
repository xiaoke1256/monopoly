import { Router } from 'express';

import { getAllMaps } from '../controllers/mapController.js';

const mapRouter = new Router();

// {
// 	const router = new Router();
// 	router.get('/all',  getAllMaps);
// 	mapRouter.use('/', router);
// }
mapRouter.get('/all',  getAllMaps);

export default mapRouter;