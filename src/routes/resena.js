const Router = require("koa-router");

const router = new Router();


router.post('resena.create', '/', async (ctx) => {
    try {
      const { contenido, fecha_resena, calificacion } = ctx.request.body;
      const resena = await ctx.orm.Resena.create({ contenido, fecha_resena, calificacion });
      ctx.body = resena;
      ctx.status = 201;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  

router.get('resena.list', '/', async (ctx) => {
  try {
    const resenas = await ctx.orm.Resena.findAll();
    ctx.body = resenas;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});
  
router.get('resena.show', '/:id', async (ctx) => {
  const { id } = ctx.params;
  const resena = await ctx.orm.Resena.findByPk(id);
  if (resena) {
    ctx.body = resena;
    ctx.status = 200;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Reseña no encontrada' };
  }
});  


router.put('resena.update', '/:id', async (ctx) => {
  try {
    const { contenido, fecha_resena, calificacion } = ctx.request.body;
    const resena = await ctx.orm.Resena.findByPk(ctx.params.id);

    if (!resena) {
      ctx.status = 404;
      ctx.body = { error: 'Reseña no encontrada' };
      return;
    }

    resena.contenido = contenido;
    resena.fecha_resena = fecha_resena;
    resena.calificacion = calificacion;
    await resena.save();

    ctx.body = resena;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.delete('/resenas/:id', async (ctx) => {
  const { id } = ctx.params;
  const reseña = await ctx.orm.Resena.findByPk(id);
  if (reseña) {
    await reseña.destroy();
    ctx.status = 204;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Reseña no encontrada' };
  }
});  


module.exports = router;