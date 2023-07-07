const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { dbConnection } = require("./database/config");
const path = require("path");
const compression = require('compression');

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio Público
app.use(express.static(path.join(__dirname, '/public')));

//BodyParser
app.use(bodyParser.json({ limit: '50mb' }));

// Lectura y parseo del body
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Compression
app.use(compression());

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/sitdowns", require("./routes/sitdown.routes"));
app.use("/api/closers", require("./routes/closer.routes"));
app.use("/api/canvassers", require("./routes/canvasser.routes"));
app.get('/*', function (req, res) { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.get('/', function (req, res) { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});