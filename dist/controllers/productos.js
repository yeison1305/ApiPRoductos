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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducto = exports.updateProducto = exports.postProducto = exports.getProducto = exports.getProductos = void 0;
const producto_1 = require("../models/producto");
// Obtener todos los productos
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield producto_1.ProductoModel.getAll();
        res.json({
            msg: 'Productos obtenidos correctamente',
            data: productos,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al obtener productos',
            error: String(error),
        });
    }
});
exports.getProductos = getProductos;
// Obtener un producto por ID
const getProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const producto = yield producto_1.ProductoModel.getById(Number(id));
        if (!producto) {
            return res.status(404).json({
                msg: `Producto con id ${id} no encontrado`,
            });
        }
        res.json({
            msg: 'Producto obtenido correctamente',
            data: producto,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: `Error al obtener producto con id ${id}`,
            error: String(error),
        });
    }
});
exports.getProducto = getProducto;
// Crear un nuevo producto
const postProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const nuevoProducto = yield producto_1.ProductoModel.create({ name, description, price, stock });
        res.status(201).json({
            msg: 'Producto creado correctamente',
            data: nuevoProducto,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear producto',
            error: String(error),
        });
    }
});
exports.postProducto = postProducto;
// Actualizar un producto
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const productoActualizado = yield producto_1.ProductoModel.update(numericId, { name, description, price, stock });
        if (!productoActualizado) {
            return res.status(404).json({
                msg: `Producto con id ${id} no encontrado`,
            });
        }
        res.json({
            msg: 'Producto actualizado correctamente',
            data: productoActualizado,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: `Error al actualizar producto con id ${id}`,
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.updateProducto = updateProducto;
// Eliminar un producto
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const eliminado = yield producto_1.ProductoModel.delete(Number(id));
        if (!eliminado) {
            return res.status(404).json({
                msg: `Producto con id ${id} no encontrado`,
            });
        }
        res.json({
            msg: 'Producto eliminado correctamente',
        });
    }
    catch (error) {
        res.status(500).json({
            msg: `Error al eliminar producto con id ${id}`,
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.deleteProducto = deleteProducto;
