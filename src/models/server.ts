import express, { Request, Response } from 'express';
import routesProducto from '../routes/productos';
import routesBrands from '../routes/brands'; // Nueva importación
import cors from 'cors';
import db from '../db/connection';

class Server {
  private app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
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
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        msg: 'API corriendo',
      });
    });

    this.app.use('/api/productos', routesProducto);
    this.app.use('/api/brands', routesBrands); // Nueva ruta para marcas
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  async dbConnect() {
    try {
      await db.query('SELECT 1'); // Prueba simple para verificar la conexión
      console.log('Base de datos conectada');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }
}

export default Server;