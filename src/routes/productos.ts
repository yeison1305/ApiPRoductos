import { Router } from 'express';
import { getProductos, getProducto, postProducto, updateProducto, deleteProducto, searchProductos } from '../controllers/productos';

const router = Router();

router.get('/', getProductos);
router.get('/search', searchProductos);
router.get('/:id', getProducto);
router.post('/', postProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;