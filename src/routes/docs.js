import {join} from 'path';
import {Router} from 'express';

const router = new Router();

const sendFile = file => (_, res) => {
  res.sendFile(join(process.cwd(), file));
};

router.get('/', sendFile('api/index.html'));

router.get('/swagger.yaml', sendFile('api/swagger.yaml'));

export default router;
