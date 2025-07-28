"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brands_1 = require("../controllers/brands");
const router = (0, express_1.Router)();
router.get('/', brands_1.getBrands);
exports.default = router;
