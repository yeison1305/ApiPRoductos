import express, { application, Request, Response } from 'express'
import routesProducto from '../routes/productos';
import cors from 'cors';
import db from '../db/connection';

class server {
private app: express.Application;
private port: string;

constructor() {
    this.app = express();
    this.port = process.env.PORT || '3001';
    this.listen();
    this.middleware();
    this.routes();
    this.dbConnect(); // Llamada al método para conectar la base de datos
}

    listen() {
        this.app.listen(this.port, () => {  
            console.log(`aplicacion corriendo en el puerto ${this.port}`);
        })
    }

routes() {
    this.app.get('/', (req: Request, res:Response) => {
        res.json({
            msg:'api corriendo'
        });
})

    this.app.use('/api/productos', routesProducto);
}

middleware() {
//parseamos el body
    this.app.use(express.json());
//cors
    this.app.use(cors());
}
//
async  dbConnect() {
       
    try {
            await db.connect();
            console.log('Base de datos conectada');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
    }



}
export default server;