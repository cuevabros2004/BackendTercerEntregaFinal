import { STRING_CONEXION_MONGO, USUARIO_CONEXION_MONGO, PASSWORD_CONEXION_MONGO,  BD_MONGO} from './config.js'
import {PUERTO_POR_DEFECTO} from './config.js'
import mongoose from 'mongoose'
import express from 'express';
import routerApiProducts from './routers/routerApiProducts.js'
import routerApiShoppingCart from './routers/routerApiShoppingCart.js'
import { Server as HttpServer } from 'http'
import logIn from './logIn.js'
import routerLogin from './routers/routerLogin.js'
import routerApiBuy from './routers/routerApiBuy.js'
import loggerInfo from './pinoInfo.js';
import loggerError from './pinoError.js';
import parseArgs from 'yargs/yargs'


const servidor = express()

const httpServer = new HttpServer(servidor)

//Middlewares para resolver los datos que viene por el Post
//Si viene por un Json o si viene de un formulario (Form)
servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }))

///LOGIN CON SESSION Y PASSPORT
logIn(servidor);

//Middlewares para los routers
servidor.use('/api/products', routerApiProducts)
servidor.use('/api/shoppingcart', routerApiShoppingCart)
servidor.use('/', routerLogin)
servidor.use('/api/buy', routerApiBuy)
servidor.use(express.static('public'))
servidor.use((err, req, res, next) => loggerError(err.message));

//Si viene de una ruta no implementada
servidor.all('*', (req, res) => {
  res.status(404).json({error: "404", descripcion: "ruta " + req.url + " método " + req.method + " no implementado"})
})



const yargs = parseArgs(process.argv.slice(2))

const argv = yargs.alias({p: 'port'}).default({port: PUERTO_POR_DEFECTO}).argv

const puerto = argv.port



function conectar_mongoose(){
try {
  const mongo = mongoose.connect(STRING_CONEXION_MONGO + USUARIO_CONEXION_MONGO + ':' + PASSWORD_CONEXION_MONGO + BD_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected DB");
} catch (error) {
  console.log(`Error en conexión de Base de datos: ${error}`);
}
}

function conectar() {
  conectar_mongoose()
  return new Promise((resolve, reject) => {
    const servidorConectado = httpServer.listen(puerto, () => {
      resolve(servidorConectado)
    })

  })
}

 

 export default  conectar 


















