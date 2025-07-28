"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const connection_1 = __importDefault(require("../db/connection"));
class ProductModel {
    // Obtener todos los productos con sus tallas, marca y calificación
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows: products } = yield connection_1.default.query(`
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
                return products.map((row) => (Object.assign(Object.assign({}, row), { sizes: row.sizes.filter((s) => s.size_id !== null), brand: row.brand_id ? { id: row.brand_id, name: row.brand_name, image_url: row.brand_image_url } : null, rating: row.rating_rate ? { product_id: row.product_id, rating_rate: row.rating_rate, rating_count: row.rating_count } : null })));
            }
            catch (error) {
                throw new Error(`Error al obtener productos: ${error}`);
            }
        });
    }
    // Obtener un producto por ID con sus tallas, marca y calificación
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield connection_1.default.query(`
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
                if (!rows[0])
                    return null;
                return Object.assign(Object.assign({}, rows[0]), { sizes: rows[0].sizes.filter((s) => s.size_id !== null), brand: rows[0].brand_id ? { id: rows[0].brand_id, name: rows[0].brand_name, image_url: rows[0].brand_image_url } : null, rating: rows[0].rating_rate ? { product_id: rows[0].product_id, rating_rate: rows[0].rating_rate, rating_count: rows[0].rating_count } : null });
            }
            catch (error) {
                throw new Error(`Error al obtener producto con id ${id}: ${error}`);
            }
        });
    }
    // Crear un nuevo producto con tallas
    static create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.default.connect();
            try {
                yield client.query('BEGIN');
                const { rows: productRows } = yield client.query('INSERT INTO products (title, description, category, type, animal_category, brand_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [product.title, product.description, product.category, product.type, product.animal_category, product.brand_id]);
                const newProduct = productRows[0];
                if (product.sizes && product.sizes.length > 0) {
                    for (const size of product.sizes) {
                        yield client.query('INSERT INTO product_sizes (product_id, size, price, stock_quantity, image_url, catalog_product_id) VALUES ($1, $2, $3, $4, $5, $6)', [newProduct.id, size.size, size.price, size.stock_quantity, size.image_url, size.catalog_product_id]);
                    }
                }
                yield client.query('COMMIT');
                const createdProduct = yield this.getById(newProduct.id);
                if (!createdProduct) {
                    throw new Error('Producto creado pero no encontrado al consultar.');
                }
                return createdProduct;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al crear producto: ${error}`);
            }
            finally {
                client.release();
            }
        });
    }
    // Actualizar un producto y sus tallas
    static update(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield connection_1.default.connect();
            try {
                yield client.query('BEGIN');
                const { rows: productRows } = yield client.query('UPDATE products SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category), type = COALESCE($4, type), animal_category = COALESCE($5, animal_category), brand_id = COALESCE($6, brand_id) WHERE id = $7 RETURNING *', [product.title, product.description, product.category, product.type, product.animal_category, product.brand_id, id]);
                if (!productRows[0]) {
                    yield client.query('ROLLBACK');
                    return null;
                }
                if (product.sizes) {
                    yield client.query('DELETE FROM product_sizes WHERE product_id = $1', [id]);
                    for (const size of product.sizes) {
                        yield client.query('INSERT INTO product_sizes (product_id, size, price, stock_quantity, image_url, catalog_product_id) VALUES ($1, $2, $3, $4, $5, $6)', [id, size.size, size.price, size.stock_quantity, size.image_url, size.catalog_product_id]);
                    }
                }
                yield client.query('COMMIT');
                return yield this.getById(id);
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw new Error(`Error al actualizar producto con id ${id}: ${error}`);
            }
            finally {
                client.release();
            }
        });
    }
    // Eliminar un producto
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rowCount } = yield connection_1.default.query('DELETE FROM products WHERE id = $1', [id]);
                return (rowCount !== null && rowCount !== void 0 ? rowCount : 0) > 0;
            }
            catch (error) {
                throw new Error(`Error al eliminar producto con id ${id}: ${error}`);
            }
        });
    }
    // Buscar productos por texto
    static search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield connection_1.default.query(`
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
                return rows.map((row) => (Object.assign(Object.assign({}, row), { sizes: row.sizes.filter((s) => s.size_id !== null), brand: row.brand_id ? { id: row.brand_id, name: row.brand_name, image_url: row.brand_image_url } : null, rating: row.rating_rate ? { product_id: row.product_id, rating_rate: row.rating_rate, rating_count: row.rating_count } : null })));
            }
            catch (error) {
                throw new Error(`Error al buscar productos: ${error}`);
            }
        });
    }
}
exports.ProductModel = ProductModel;
exports.default = ProductModel;
