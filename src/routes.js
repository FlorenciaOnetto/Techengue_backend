const Router = require("koa-router");
const user = require("./routes/user.js");
const fundacion = require("./routes/fundacion.js");
const administrador = require("./routes/administrador.js");
const voluntario = require("./routes/voluntario.js");
const resena = require("./routes/resena.js");
const proyectosolidario = require("./routes/proyectosolidario.js");
const chat = require("./routes/chat.js");
const publicacion = require("./routes/publicacion.js");
const inscripcion = require("./routes/inscripcion.js")
const authRoutes = require("./routes/authentication.js")
const dotenv = require('dotenv');
const jwtMiddeleware = require('koa-jwt')
const scopeProtectedRoutes = require('./routes/scopeExample.js')

dotenv.config();

const router = new Router();


router.use("/fundacion", fundacion.routes());
router.use("/administrador", administrador.routes());
router.use("/voluntario", voluntario.routes());
router.use("/resena", resena.routes());
router.use("/proyectosolidario", proyectosolidario.routes());
router.use("/chat", chat.routes());
router.use("/publicacion", publicacion.routes());
router.use("/inscripcion", inscripcion.routes());
router.use(authRoutes.routes());


router.use("/user", user.routes());

// Desde esta linea, todas las rutas requeriran un jwt.
router.use(jwtMiddeleware( { secret: process.env.JWT_SECRET } ))


router.use('/scope-example', scopeProtectedRoutes.routes())

module.exports = router;
