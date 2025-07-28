import pool from '../db/connection'; // Ajustado a tu ruta de conexión

// Interfaz para la entidad Brand
export interface Brand {
  id: number;
  name: string;
  image_url: string | null;
}

// Clase para manejar operaciones con marcas
export class BrandModel {
  // Obtener todas las marcas
  static async getAll(): Promise<Brand[]> {
    try {
      const { rows } = await pool.query('SELECT id, name, image_url FROM brands');
      return rows as Brand[];
    } catch (error) {
      throw new Error(`Error al obtener marcas: ${String(error)}`);
    }
  }
}