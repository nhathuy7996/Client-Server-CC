import { Router } from 'express';
import { postAPI, getAPI } from '../controllers/privateAPIExampleController';

const privateExampleRouter = Router();

privateExampleRouter.post('/', postAPI);
privateExampleRouter.get('/', getAPI);

export default privateExampleRouter; 