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
exports.ProductoModel = void 0;
const connection_1 = __importDefault(require("../db/connection"));
class ProductoModel {
    // Obtener todos los productos
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield connection_1.default.query('SELECT * FROM productos');
                return rows;
            }
            catch (error) {
                throw new Error(`Error al obtener productos: ${error}`);
            }
        });
    }
    // Obtener un producto por ID
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield connection_1.default.query('SELECT * FROM productos WHERE id = $1', [id]);
                return rows[0] || null;
            }
            catch (error) {
                throw new Error(`Error al obtener producto con id ${id}: ${error}`);
            }
        });
    }
    // Crear un nuevo producto
    static create(producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, stock } = producto;
            try {
                const { rows } = yield connection_1.default.query('INSERT INTO productos (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, price, stock]);
                return rows[0];
            }
            catch (error) {
                throw new Error(`Error al crear producto: ${error}`);
            }
        });
    }
    // Actualizar un producto
    static update(id, producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, stock } = producto;
            try {
                const { rows } = yield connection_1.default.query('UPDATE productos SET name = COALESCE($1, name), description = COALESCE($2, description), price = COALESCE($3, price), stock = COALESCE($4, stock) WHERE id = $5 RETURNING *', [name, description, price, stock, id]);
                return rows[0] || null;
            }
            catch (error) {
                throw new Error(`Error al actualizar producto con id ${id}: ${error}`);
            }
        });
    }
    // Eliminar un producto
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rowCount } = yield connection_1.default.query('DELETE FROM productos WHERE id = $1', [id]);
                return (rowCount !== null && rowCount !== void 0 ? rowCount : 0) > 0;
            }
            catch (error) {
                throw new Error(`Error al eliminar producto con id ${id}: ${error}`);
            }
        });
    }
}
exports.ProductoModel = ProductoModel;
exports.default = ProductoModel;
