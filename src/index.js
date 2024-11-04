const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth'); // Importa directamente sin destructuring
const mascotasRoutes = require('./routes/mascotas');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/test-image', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', '1730667411186.jpeg'));
});


sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
  .catch(error => console.error('No se pudo conectar a la base de datos:', error));

sequelize.sync();

// Rutas
app.use('/auth', authRoutes); 
app.use('/mascotas', mascotasRoutes);

app.get('/', (req, res) => {
    res.send('Hello World from Backend!!!');
});

app.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});
