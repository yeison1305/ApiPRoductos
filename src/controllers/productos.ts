import { Request, Response } from 'express';
import { ProductoModel } from '../models/producto';

// Obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await ProductoModel.getAll();
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
    const producto = await ProductoModel.getById(Number(id));
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
  const { name, description, price, stock } = req.body;

  // Validaciones
  if (!name || !description || price == null || stock == null) {
    return res.status(400).json({
      msg: 'Faltan campos obligatorios: name, description, price, stock',
    });
  }
  if (typeof price !== 'number' || typeof stock !== 'number') {
    return res.status(400).json({
      msg: 'Price y stock deben ser números',
    });
  }

  try {
    const nuevoProducto = await ProductoModel.create({ name, description, price, stock });
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
    const { name, description, price, stock } = req.body || {};
  
    // Validar que id sea un número válido
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({
        msg: 'El id proporcionado no es un número válido',
      });
    }
  
    // Validar que al menos un campo esté presente para actualizar
    if (!name && !description && price === undefined && stock === undefined) {
      return res.status(400).json({
        msg: 'Se requiere al menos un campo para actualizar (name, description, price, stock)',
      });
    }
  
    try {
      const productoActualizado = await ProductoModel.update(numericId, { name, description, price, stock });
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
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
// Eliminar un producto

export const deleteProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const eliminado = await ProductoModel.delete(Number(id));
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
      error: error instanceof Error ? error.message : String(error),
    });
  }
};