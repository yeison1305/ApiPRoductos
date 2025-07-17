import pool from '../db/connection';

// Interfaz para el modelo Producto
export interface Producto {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class ProductoModel {
  // Obtener todos los productos
  static async getAll(): Promise<Producto[]> {
    try {
      const { rows } = await pool.query('SELECT * FROM productos');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error}`);
    }
  }
  

  // Obtener un producto por ID
  static async getById(id: number): Promise<Producto | null> {
    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error al obtener producto con id ${id}: ${error}`);
    }
  }

  // Crear un nuevo producto
  static async create(producto: Producto): Promise<Producto> {
    const { name, description, price, stock } = producto;
    try {
      const { rows } = await pool.query(
        'INSERT INTO productos (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, stock]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error al crear producto: ${error}`);
    }
  }

  // Actualizar un producto
  static async update(id: number, producto: Partial<Producto>): Promise<Producto | null> {
    const { name, description, price, stock } = producto;
    try {
      const { rows } = await pool.query(
        'UPDATE productos SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), stock = COALESCE($4, stock) WHERE id = $5 RETURNING *',
        [name, description, price, stock, id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error al actualizar producto con id ${id}: ${error}`);
    }
  }

  // Eliminar un producto
  static async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Error al eliminar producto con id ${id}: ${error}`);
    }
  }
}

export default ProductoModel;