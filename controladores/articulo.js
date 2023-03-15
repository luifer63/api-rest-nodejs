const { validarArticulo } = require("../helpers/validar")
const Articulo = require("../modelos/Articulo")
const fs = require("fs")
const path = require("path")

const prueba = (req, res) => {
    return res.status(200).json({
        mensaeje: "Soy una accion de prueba en mi controlador articulos"
    })
}

const curso = (req, res) => {

    console.log("Se ha ejecutado el endpoint curso")
    return res.status(200).json([{
        curso: "Master react",
        autor: "Victor",
        url: "victorroblesweb.es/master-react"
    }])
}

const crear = (req, res) => {

    // recoger los parametros por post a guardar
    let parametros = req.body;

    //validar los datos
    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        })

    }

    // crear el objeto a guardar

    const articulo = new Articulo(parametros)

    // asignar valores a objeto 
    //articulo.titulo = parametros.titulo;


    // guardar el articulo en base de datos

    try {
        articulo.save()
        return res.status(200).json({
            status: "success",
            articulo: articulo.titulo,
            mensaje: "Articulo guardado con exito"
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "Error",
            mensaje: "No se guardó el artículo"
        })

    }

}

const listar = async (req, res) => {

    try {

        let consulta = await Articulo.find({}).limit(3).sort({ fecha: -1 }).exec()

        console.log(consulta)

        return res.status(200).send({
            status: "success",
            contador: consulta.length,
            articulos: consulta
        })

    } catch (error) {
        return res.status(404).json({
            status: "Error",
            mensaje: "No se han encontrado artículos"
        })
    }

}

const uno = async (req, res) => {
    //Id por la url
    let id = req.params.id

    //buscar el articulo
    try {
        let consulta = await Articulo.findById(id)
        return res.status(200).send({
            status: "success",
            contador: consulta.length,
            articulos: consulta
        })

    } catch (error) {
        return res.status(404).json({
            status: "Error",
            mensaje: "No se ha encontrado el artículo"
        })
    }

}

const borrar = async (req, res) => {

    let id = req.params.id
    try {
        let consulta = await Articulo.findOneAndDelete({ _id: id })
        return res.status(200).send({
            status: "success",
            articulo: consulta,
            mensaje: "Articulo borrado"
        })

    } catch (error) {
        return res.status(500).json({
            status: "Error",
            mensaje: "Error al borrar"
        })
    }
}



const editar = async (req, res) => {

    let articuloId = req.params.id

    let parametros = req.body

    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        })

    }

    try {
        let consulta = await Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true })
        return res.status(200).send({
            status: "success",
            articulo: consulta,
            mensaje: "Articulo actualizado"
        })

    } catch (error) {
        return res.status(500).json({
            status: "Error",
            mensaje: "Error al borrar"
        })
    }



}

const subir = async (req, res) => {

    // Configurar multer

    // recoger archivo imagen
    console.log(req.file)

    if (!req.file && !req.files) {

        return res.status(404).json({
            status: "Error",
            mensaje: "Petición invalida"
        })


    }

    // conseguir nombre y extension de imagen

    let archivo = req.file.originalname

    let archivoSplit = archivo.split("\.")
    let archivoExt = archivoSplit[1]
    

    if (archivoExt != "png" && archivoExt != "jpg"
        && archivoExt != "jpeg" && archivoExt != "gif") {

        // borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "Error",
                mensaje: "Imagen invalida"
            })
        })


    } else {
        // si todo OK, actualizar el articulo

        let articuloId = req.params.id

        try {
            let consulta = await Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename }, { new: true })
            return res.status(200).send({
                status: "success",
                articulo: consulta,
                mensaje: "Articulo actualizado"
            })

        } catch (error) {
            return res.status(500).json({
                status: "Error",
                mensaje: "Error al borrar"
            })
        }
    }
}

const imagen = (req, res) => {

    let fichero = req.params.fichero
    let ruta_fisica = "./imagenes/articulos/" + fichero

    console.log(ruta_fisica)

    fs.stat(ruta_fisica, (error, existe) => {
        console.log(existe)
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica))
        }else{
            return res.status(404).json({
                status: "Error",
                mensaje: "La imagen no existe"
            })

        }
    })
}

const buscar = async (req, res) => {

    //sacar string de busqueda

    let busqueda = req.params.busqueda

    try {
        let articulos = await Articulo.find({ "$or": [
            {"titulo": {"$regex": busqueda, "$options": "i"}},
            {"contenido": {"$regex": busqueda, "$options": "i"}},
        ]})
        .sort({fecha: -1})
        .exec()

        if(articulos.length <= 0){
            return res.status(404).json({
                status: "Error",
                mensaje: "No se han encontrado artículos"
            })
            
        }

        return res.status(200).json({
            status: "success",
            articulos
        })

    } catch (error) {
        return res.status(500).json({
            status: "Error",
            mensaje: "Error en la busqueda"
        })
    }


    // find OR

    


    // orden

    // ejecutar consulta


    //devolver resultado



}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscar
}