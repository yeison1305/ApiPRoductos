"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productos_1 = __importDefault(require("../routes/productos"));
const brands_1 = __importDefault(require("../routes/brands")); // Nueva importación
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.listen();
        this.middleware();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicación corriendo en el puerto ${this.port}`);
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({
                msg: 'API corriendo',
            });
        });
        this.app.use('/api/productos', productos_1.default);
        this.app.use('/api/brands', brands_1.default); // Nueva ruta para marcas
    }
    middleware() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    async dbConnect() {
        try {
            await connection_1.default.query('SELECT 1'); // Prueba simple para verificar la conexión
            console.log('Base de datos conectada');
        }
        catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
    }
}
exports.default = Server;
