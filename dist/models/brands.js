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
exports.BrandModel = void 0;
const connection_1 = __importDefault(require("../db/connection")); // Ajustado a tu ruta de conexión
// Clase para manejar operaciones con marcas
class BrandModel {
    // Obtener todas las marcas
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield connection_1.default.query('SELECT id, name, image_url FROM brands');
                return rows;
            }
            catch (error) {
                throw new Error(`Error al obtener marcas: ${String(error)}`);
            }
        });
    }
}
exports.BrandModel = BrandModel;
