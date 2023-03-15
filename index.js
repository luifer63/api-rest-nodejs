const {conexion} = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors")

//inicializar app
console.log("App node arrancada")

//conectar base de datos
conexion()


// crear servidor node
const app = express();
const puerto = 3900;

// configurar cors

app.use(cors());

// convertir body a objeto js

app.use(express.json()) // recibir datos content-type app/json

app.use(express.urlencoded({extended: true})) /// form urlencoded


// crear rutas
const rutas_articulo = require("./rutas/articulo")
//cargo las rutas

app.use("/api", rutas_articulo)

// rutas prueba hardcode
app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando")
    return res.status(200).send(`
    <div>
        <h1>Probando ruta nodejs</h1>
        <p>Creando api rest con node </p>
    </div>
    `)
})

app.get("/", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando")
    return res.status(200).send(`
    <div>
        <h1>Probando ruta nodejs</h1>       
    </div>
    `)
})


// crear peticiones

app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto "+ puerto);
})
