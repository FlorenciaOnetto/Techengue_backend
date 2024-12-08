const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

// Importación de modelos
const Mascota = require('./models/Mascota');
const Solicitud = require('./models/Solicitud');
const Usuario = require('./models/Usuario');

// Importación de rutas
const authRoutes = require('./routes/auth');
const mascotasRoutes = require('./routes/mascotas');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://techengue-frontend.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.get('/test-image', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', '1730667411186.jpeg'));
});

// Autenticación de la base de datos
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
  .catch(error => console.error('No se pudo conectar a la base de datos:', error));

// Configuración de asociaciones entre modelos
Mascota.associate = (models) => {
    Mascota.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    Mascota.hasMany(models.Solicitud, { foreignKey: 'id_mascota', as: 'solicitudes' });
};
Solicitud.associate = (models) => {
    Solicitud.belongsTo(models.Mascota, { foreignKey: 'id_mascota', as: 'mascota' });
    Solicitud.belongsTo(models.Usuario, { foreignKey: 'id_potencial_adoptante', as: 'potencial_adoptante' });
};
Usuario.associate = (models) => {
    Usuario.hasMany(models.Mascota, { foreignKey: 'id_usuario' });
    Usuario.hasMany(models.Solicitud, { foreignKey: 'id_potencial_adoptante' });
};

// Registrar los modelos y asociaciones
const models = { Mascota, Solicitud, Usuario };
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

// Sincronizar modelos con la base de datos
sequelize.sync()
  .then(() => console.log('Sincronización de la base de datos completada.'))
  .catch(error => console.error('Error al sincronizar la base de datos:', error));

// Rutas
app.use('/auth', authRoutes); 
app.use('/mascotas', mascotasRoutes);
app.use('/solicitudes', solicitudesRoutes);

app.get('/', (req, res) => {
    res.send('Hello World from Backend!!!');
});

app.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});