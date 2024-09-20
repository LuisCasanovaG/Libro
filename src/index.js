/*.env es la variable de entorno*/

/****************** para crear la ruta ***************************/
/****************** importa librerias ****************************/
const express = require("express");/*importa paquete express/*/
const cors=require("cors");//libreria para soportar en diferente servidor
const mongoose=require("mongoose");
require("dotenv").config();//es para crear un enlace de coneccion / variable de entorno
/************************************************************************/


const app =express(); //instancia
app.use(express.json());
app.use(cors()); //manejador de ruta 


//const libros =[
//    {id:1,titulo:"1984",autor:"George Orwell"},
//   {id:2,titulo:"Cien años de soledad",autor:"Gabriel Garcia Marquez"}
//];

//se crea la ruta
app.get("/", (req, res)=>{
    res.send("Bienvenidos a la API de Libros");
});

app.listen(3000,()=>{
    console.log("Servidor Ejecutandose en http://localhost:3000")//ctrl+c para parar el servidor 

});

/**********Ruta para pedir todos los libros****************/
app.get("/libros", async (req,res)=>{ 
    /* res.json(libros); */
    try {
        const libros =await Libro.find();
        res.json(libros);
    } catch (error) {
        res.status(500).send("Error al obtener el libro", error);
    }
    });


/************** SE CONECTA A LA VARIABLE DE ENTONRNO ************************/
const mongoUri=process.env.MONGODB_URI; //aca se conecta con la variable de entorno .envi

try {
    mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
} catch (error) {
    console.error("Error de conexion", error);
}
/***************************************************************************/


const libroSchema=new mongoose.Schema({//para crear base de dato esquema
    titulo: String,
    autor: String,
});

const Libro = mongoose.model("Libro",libroSchema);// con este modelo es para tener acceso

//para crear nueva ruta. que nos permite crear un nuevo libro
app.post("/libros", async (req,res)=>{
    /* const libro = {
        titulo: req.body.titulo,
        autor: req.body.autor,
    } 
    libros.push(libro);//agregamos la base de datos
    res.json(libro);*/
    const libro= new Libro({ //se usa el modelo
        titulo: req.body.titulo,
        autor: req.body.autor,
    });
    try {
        await libro.save();//para guardar los datos a la base de datos
        res.json(libro);//respuesta que se guarda en libro
    } catch (error) {
        res.status(500).send("Error al guardar el libro", error);
    }
    
    });

/***************BUSCA UN LIBRO POR SU ID **************************/
app.get("/libros/:id", async (req,res)=>{
    try {
        const libro=await Libro.findById(req.params.id);
        if(libro){
            res.json(libro);
        }else {
            res.status(400).send("Libro no encontrado")
        }
    } catch (error) {
        res.status(500).send("Error al buscar el libro", error);
    }
})

/*****minwork ** CLAVE DE AUTORIZACION**/
app.use((req,res,next)=>{
    const authoken=req.headers["authorization"];
    
    if(authoken==="miTokenSecreto123"){
        next();
    }else{
        res.status(401).send("Acceso no autorizado");
    }
    })


