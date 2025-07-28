import { Request, Response } from 'express';
import { ProductModel, Product } from '../models/producto';

// Obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await ProductModel.getAll();
    res.json({
      msg: 'Productos obtenidos correctamente',
      data: productos,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener productos',
      error: String(error),
    });
  }
};

// Obtener un producto por ID
export const getProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const producto = await ProductModel.getById(Number(id));
    if (!producto) {
      return res.status(404).json({
        msg: `Producto con id ${id} no encontrado`,
      });
    }
    res.json({
      msg: 'Producto obtenido correctamente',
      data: producto,
    });
  } catch (error) {
    res.status(500).json({
      msg: `Error al obtener producto con id ${id}`,
      error: String(error),
    });
  }
};

// Crear un nuevo producto
export const postProducto = async (req: Request, res: Response) => {
  const { title, description, category, type, animal_category, brand_id, sizes } = req.body as Product;

  // Validaciones
  if (!title || !description || !category || !type || !animal_category || !brand_id) {
    return res.status(400).json({
      msg: 'Faltan campos obligatorios: title, description, category, type, animal_category, brand_id',
    });
  }
  if (sizes && !Array.isArray(sizes)) {
    return res.status(400).json({
      msg: 'Sizes debe ser un arreglo',
    });
  }
  if (sizes) {
    for (const size of sizes) {
      if (!size.size || size.price == null || size.stock_quantity == null) {
        return res.status(400).json({
          msg: 'Cada talla debe tener size, price y stock_quantity',
        });
      }
      if (typeof size.price !== 'number' || size.price < 0 || typeof size.stock_quantity !== 'number' || size.stock_quantity < 0) {
        return res.status(400).json({
          msg: 'Price y stock_quantity deben ser números no negativos',
        });
      }
    }
  }

  try {
    const nuevoProducto = await ProductModel.create({ title, description, category, type, animal_category, brand_id, sizes });
    res.status(201).json({
      msg: 'Producto creado correctamente',
      data: nuevoProducto,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al crear producto',
      error: String(error),
    });
  }
};

// Actualizar un producto
export const updateProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category, type, animal_category, brand_id, sizes } = req.body as Partial<Product>;

  // Validar que id sea un número válido
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return res.status(400).json({
      msg: 'El id proporcionado no es un número válido',
    });
  }

  // Validar que al menos un campo esté presente para actualizar
  if (!title && !description && !category && !type && !animal_category && !brand_id && !sizes) {
    return res.status(400).json({
      msg: 'Se requiere al menos un campo para actualizar (title, description, category, type, animal_category, brand_id, sizes)',
    });
  }
  if (sizes && !Array.isArray(sizes)) {
    return res.status(400).json({
      msg: 'Sizes debe ser un arreglo',
    });
  }
  if (sizes) {
    for (const size of sizes) {
      if (!size.size || size.price == null || size.stock_quantity == null) {
        return res.status(400).json({
          msg: 'Cada talla debe tener size, price y stock_quantity',
        });
      }
      if (typeof size.price !== 'number' || size.price < 0 || typeof size.stock_quantity !== 'number' || size.stock_quantity < 0) {
        return res.status(400).json({
          msg: 'Price y stock_quantity deben ser números no negativos',
        });
      }
    }
  }

  try {
    const productoActualizado = await ProductModel.update(numericId, { title, description, category, type, animal_category, brand_id, sizes });
    if (!productoActualizado) {
      return res.status(404).json({
        msg: `Producto con id ${id} no encontrado`,
      });
    }
    res.json({
      msg: 'Producto actualizado correctamente',
      data: productoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      msg: `Error al actualizar producto con id ${id}`,
      error: String(error),
    });
  }
};

// Eliminar un producto

export const deleteProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const eliminado = await ProductModel.delete(Number(id));
    if (!eliminado) {
      return res.status(404).json({
        msg: `Producto con id ${id} no encontrado`,
      });
    }
    res.json({
      msg: 'Producto eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      msg: `Error al eliminar producto con id ${id}`,
      error: String(error),
    });
  }
};

// Buscar productos por texto
export const searchProductos = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      msg: 'Se requiere un parámetro de búsqueda (q)',
    });
  }

  try {
    const productos = await ProductModel.search(q);
    res.json({
      msg: 'Productos encontrados',
      data: productos,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al buscar productos',
      error: String(error),
    });
  }
};