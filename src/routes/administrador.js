const Router = require("koa-router");

const router = new Router();


router.post('administrador.create', '/', async (ctx) => {
    try {
      const {} = ctx.request.body;
      const administrador = await ctx.orm.Administrador.create();
      ctx.body = administrador;
      ctx.status = 201;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});

  router.get('administrador.list', '/', async (ctx) => {
    try {
      const administradores = await ctx.orm.Administrador.findAll();
      ctx.body = administradores;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});

 



module.exports = router;