const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json()); // Middleware para JSON

// Conectar a la base de datos
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
  .catch(error => console.error('No se pudo conectar a la base de datos:', error));

sequelize.sync();

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello World from Backend!!!');
});

app.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});
