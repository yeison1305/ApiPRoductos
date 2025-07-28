"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrands = void 0;
const brands_1 = require("../models/brands");
const getBrands = async (req, res) => {
    try {
        const brands = await brands_1.BrandModel.getAll();
        res.status(200).json(brands);
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al obtener marcas',
            error: String(error),
        });
    }
};
exports.getBrands = getBrands;
