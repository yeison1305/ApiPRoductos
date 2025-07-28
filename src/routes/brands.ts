import { Router } from 'express';
import { getBrands } from '../controllers/brands';

const router = Router();

router.get('/', getBrands);

export default router;