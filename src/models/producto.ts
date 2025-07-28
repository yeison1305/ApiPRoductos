import pool from '../db/connection';

// Interfaces para las tablas
export interface Product {
  id?: number;
  title: string;
  description: string;
  category: string;
  type: string;
  animal_category: string;
  brand_id: number;
  created_at?: string;
  sizes?: ProductSize[];
  rating?: Rating;
  brand?: Brand;
}

export interface ProductSize {
  size_id?: number;
  product_id: number;
  size: string;
  price: number;
  is_free?: boolean;
  stock_quantity: number;
  image_url?: string;
  catalog_product_id?: string;
}

export interface Rating {
  product_id: number;
  rating_rate?: number;
  rating_count?: number;
}

export interface Brand {
  id?: number;
  name: string;
  created_at?: string;
  image_url?: string;
}

export class ProductModel {
  // Obtener todos los productos con sus tallas, marca y calificación
  static async getAll(): Promise<Product[]> {
    try {
      const { rows: products } = await pool.query(`
        SELECT 
          p.id, p.title, p.description, p.category, p.type, p.animal_category, p.brand_id, p.created_at,
          b.id AS brand_id, b.name AS brand_name, b.image_url AS brand_image_url,
          r.rating_rate, r.rating_count,
          json_agg(
            json_build_object(
              'size_id', ps.size_id,
              'product_id', ps.product_id,
              'size', ps.size,
              'price', ps.price,
              'is_free', ps.is_free,
              'stock_quantity', ps.stock_quantity,
              'image_url', ps.image_url,
              'catalog_product_id', ps.catalog_product_id
            )
          ) AS sizes
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN ratings r ON p.id = r.product_id
        LEFT JOIN product_sizes ps ON p.id = ps.product_id
        GROUP BY p.id, b.id, r.product_id
      `);
      return products.map((row: any) => ({
        ...row,
        sizes: row.sizes.filter((s: any) => s.size_id !== null), // Filtra tallas nulas
        brand: row.brand_id ? { id: row.brand_id, name: row.brand_name, image_url: row.brand_image_url } : null,
        rating: row.rating_rate ? { product_id: row.product_id, rating_rate: row.rating_rate, rating_count: row.rating_count } : null,
      }));
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error}`);
    }
  }

  // Obtener un producto por ID con sus tallas, marca y calificación
  static async getById(id: number): Promise<Product | null> {
    try {
      const { rows } = await pool.query(`
        SELECT 
          p.id, p.title, p.description, p.category, p.type, p.animal_category, p.brand_id, p.created_at,
          b.id AS brand_id, b.name AS brand_name, b.image_url AS brand_image_url,
          r.rating_rate, r.rating_count,
          json_agg(
            json_build_object(
              'size_id', ps.size_id,
              'product_id', ps.product_id,
              'size', ps.size,
              'price', ps.price,
              'is_free', ps.is_free,
              'stock_quantity', ps.stock_quantity,
              'image_url', ps.image_url,
              'catalog_product_id', ps.catalog_product_id
            )
          ) AS sizes
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN ratings r ON p.id = r.product_id
        LEFT JOIN product_sizes ps ON p.id = ps.product_id
        WHERE p.id = $1
        GROUP BY p.id, b.id, r.product_id
      `, [id]);
      if (!rows[0]) return null;
      return {
        ...rows[0],
        sizes: rows[0].sizes.filter((s: any) => s.size_id !== null),
        brand: rows[0].brand_id ? { id: rows[0].brand_id, name: rows[0].brand_name, image_url: rows[0].brand_image_url } : null,
        rating: rows[0].rating_rate ? { product_id: rows[0].product_id, rating_rate: rows[0].rating_rate, rating_count: rows[0].rating_count } : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener producto con id ${id}: ${error}`);
    }
  }

  // Crear un nuevo producto con tallas
  static async create(product: Product): Promise<Product> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: productRows } = await client.query(
        'INSERT INTO products (title, description, category, type, animal_category, brand_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [product.title, product.description, product.category, product.type, product.animal_category, product.brand_id]
      );
      const newProduct = productRows[0];

      if (product.sizes && product.sizes.length > 0) {
        for (const size of product.sizes) {
          await client.query(
            'INSERT INTO product_sizes (product_id, size, price, stock_quantity, image_url, catalog_product_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [newProduct.id, size.size, size.price, size.stock_quantity, size.image_url, size.catalog_product_id]
          );
        }
      }

      await client.query('COMMIT');
      const createdProduct = await this.getById(newProduct.id);
      if (!createdProduct) {
        throw new Error('Producto creado pero no encontrado al consultar.');
      }
      return createdProduct;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error al crear producto: ${error}`);
    } finally {
      client.release();
    }
  }

  // Actualizar un producto y sus tallas
  static async update(id: number, product: Partial<Product>): Promise<Product | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: productRows } = await client.query(
        'UPDATE products SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category), type = COALESCE($4, type), animal_category = COALESCE($5, animal_category), brand_id = COALESCE($6, brand_id) WHERE id = $7 RETURNING *',
        [product.title, product.description, product.category, product.type, product.animal_category, product.brand_id, id]
      );
      if (!productRows[0]) {
        await client.query('ROLLBACK');
        return null;
      }

      if (product.sizes) {
        await client.query('DELETE FROM product_sizes WHERE product_id = $1', [id]);
        for (const size of product.sizes) {
          await client.query(
            'INSERT INTO product_sizes (product_id, size, price, stock_quantity, image_url, catalog_product_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, size.size, size.price, size.stock_quantity, size.image_url, size.catalog_product_id]
          );
        }
      }

      await client.query('COMMIT');
      return await this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error al actualizar producto con id ${id}: ${error}`);
    } finally {
      client.release();
    }
  }

  // Eliminar un producto
  static async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Error al eliminar producto con id ${id}: ${error}`);
    }
  }

  // Buscar productos por texto
  static async search(query: string): Promise<Product[]> {
    try {
      const { rows } = await pool.query(`
        SELECT 
          p.id, p.title, p.description, p.category, p.type, p.animal_category, p.brand_id, p.created_at,
          b.id AS brand_id, b.name AS brand_name, b.image_url AS brand_image_url,
          r.rating_rate, r.rating_count,
          json_agg(
            json_build_object(
              'size_id', ps.size_id,
              'product_id', ps.product_id,
              'size', ps.size,
              'price', ps.price,
              'is_free', ps.is_free,
              'stock_quantity', ps.stock_quantity,
              'image_url', ps.image_url,
              'catalog_product_id', ps.catalog_product_id
            )
          ) AS sizes
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN ratings r ON p.id = r.product_id
        LEFT JOIN product_sizes ps ON p.id = ps.product_id
        WHERE to_tsvector('spanish', p.title || ' ' || p.description) @@ to_tsquery('spanish', $1)
        GROUP BY p.id, b.id, r.product_id
      `, [query]);
      return rows.map((row: any) => ({
        ...row,
        sizes: row.sizes.filter((s: any) => s.size_id !== null),
        brand: row.brand_id ? { id: row.brand_id, name: row.brand_name, image_url: row.brand_image_url } : null,
        rating: row.rating_rate ? { product_id: row.product_id, rating_rate: row.rating_rate, rating_count: row.rating_count } : null,
      }));
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error}`);
    }
  }
}

export default ProductModel;