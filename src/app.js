const Koa = require('koa');
const koaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors')
const router = require("./routes.js");
const orm = require('./models');
  
// Crear instancia Koa
const app = new Koa();

app.context.orm = orm;

app.use(cors());

app.use(koaLogger());
app.use(koaBody());
app.use(router.routes())

// koa-router
app.use(router.routes());

app.use ( (ctx, next) => {
    ctx.body = "Hola Mundo! Saludos desde IIC2513";
    next();
});

// app.listen(3000, () => {
//     console.log("Iniciando app. Escuchando en el puerto 3000");
// });

module.exports = app;