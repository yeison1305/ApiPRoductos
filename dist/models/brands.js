"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandModel = void 0;
const connection_1 = __importDefault(require("../db/connection")); // Ajustado a tu ruta de conexión
// Clase para manejar operaciones con marcas
class BrandModel {
    // Obtener todas las marcas
    static async getAll() {
        try {
            const { rows } = await connection_1.default.query('SELECT id, name, image_url FROM brands');
            return rows;
        }
        catch (error) {
            throw new Error(`Error al obtener marcas: ${String(error)}`);
        }
    }
}
exports.BrandModel = BrandModel;
