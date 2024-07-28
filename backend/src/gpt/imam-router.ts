import express from 'express';
import { askImam } from './imam-controller';

const router = express.Router();

router.post('/ask', askImam);

export default router;
