import { Router } from 'express';
import { deleteProducto, getProducto, getProductos, postProducto, updateProducto } from '../controllers/productos';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProducto);
router.delete('/:id', deleteProducto);
router.post('/', postProducto);
router.put('/:id', updateProducto);

export default router;