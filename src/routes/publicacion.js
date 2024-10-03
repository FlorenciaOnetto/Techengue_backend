const Router = require("koa-router");

const router = new Router();


router.post('publicacion.create', '/', async (ctx) => {
    try {
      const { contenido, fecha_publicacion } = ctx.request.body;
      const publicacion = await ctx.orm.Publicacion.create({ contenido, fecha_publicacion });
      ctx.body = publicacion;
      ctx.status = 201;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  

router.get('publicacion.list', '/', async (ctx) => {
    try {
      const publicaciones = await ctx.orm.Publicacion.findAll();
      ctx.body = publicaciones;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  

router.put('publicacion.update', '/:id', async (ctx) => {
    try {
      const { contenido, fecha_publicacion } = ctx.request.body;
      const publicacion = await ctx.orm.Publicacion.findByPk(ctx.params.id);
  
      if (!publicacion) {
        ctx.status = 404;
        ctx.body = { error: 'Publicación no encontrada' };
        return;
      }
  
      publicacion.contenido = contenido;
      publicacion.fecha_publicacion = fecha_publicacion;
      await publicacion.save();
  
      ctx.body = publicacion;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  
  router.get('publicacion.show', '/:id', async (ctx) => {
    try {
      const publicacion = await ctx.orm.Publicacion.findByPk(ctx.params.id);
  
      if (!publicacion) {
        ctx.status = 404;
        ctx.body = { message: 'Publicación no encontrada' };
        return;
      }
  
      ctx.body = publicacion;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  // Ruta DELETE para eliminar una publicación por su ID
  router.delete('publicacion.delete', '/:id', async (ctx) => {
    try {
      const publicacion = await ctx.orm.Publicacion.findByPk(ctx.params.id);
  
      if (!publicacion) {
        ctx.status = 404;
        ctx.body = { message: 'Publicación no encontrada' };
        return;
      }
  
      await publicacion.destroy(); // Elimina la publicación de la base de datos
  
      ctx.status = 200;
      ctx.body = { message: 'Publicación eliminada con éxito' };
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
module.exports = router;