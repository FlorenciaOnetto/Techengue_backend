const Router = require("koa-router");

const router = new Router();

router.post('inscripcion.create', '/', async (ctx) => {
    try {
        const { id_usuario, id_proyecto, mensaje } = ctx.request.body;
        const inscripcion = await ctx.orm.Inscripcion.create({ id_usuario, id_proyecto, mensaje });
        ctx.body = inscripcion;
        ctx.status = 201;
      } catch (error) {
        ctx.body = error;
        ctx.status = 400;
      }
    });

router.get('inscripcion.list', '/', async (ctx) => {
        try {
          const inscripciones = await ctx.orm.Inscripcion.findAll();
          ctx.body = inscripciones;
          ctx.status = 200;
        } catch (error) {
          ctx.body = error;
          ctx.status = 400;
        }
      });
module.exports = router;