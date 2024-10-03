const Router = require("koa-router");

const router = new Router();


router.post('voluntario.create', '/', async (ctx) => {
    try {
      const { horas_acumuladas } = ctx.request.body;
      const voluntario = await ctx.orm.Voluntario.create({ horas_acumuladas });
      ctx.body = voluntario;
      ctx.status = 201;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  

router.get('voluntario.list', '/', async (ctx) => {
    try {
      const voluntarios = await ctx.orm.Voluntario.findAll();
      console.log('Voluntarios:', voluntarios); // Agrega este console.log
      ctx.body = voluntarios;
      ctx.status = 200;
    } catch (error) {
      console.error(error); // Agrega este console.log
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  

  router.put('voluntario.update', '/:id', async (ctx) => {
    try {
      const { horas_acumuladas } = ctx.request.body;
      const voluntario = await ctx.orm.Voluntario.findByPk(ctx.params.id);
  
      if (!voluntario) {
        ctx.status = 404;
        ctx.body = { error: 'Voluntario no encontrado' };
        return;
      }
  
      voluntario.horas_acumuladas = horas_acumuladas;
      await voluntario.save();
  
      ctx.body = voluntario;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  router.get('voluntario.show', '/:id', async (ctx) => {
    try {
      const voluntario = await ctx.orm.Voluntario.findByPk(ctx.params.id);
  
      if (!voluntario) {
        ctx.status = 404;
        ctx.body = { message: 'Voluntario no encontrado' };
        return;
      }
  
      ctx.body = voluntario;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });
  
  // Ruta DELETE para eliminar un voluntario por su ID
  router.delete('voluntario.delete', '/:id', async (ctx) => {
    try {
      const voluntario = await ctx.orm.Voluntario.findByPk(ctx.params.id);
  
      if (!voluntario) {
        ctx.status = 404;
        ctx.body = { message: 'Voluntario no encontrado' };
        return;
      }
  
      await voluntario.destroy(); // Elimina el voluntario de la base de datos
  
      ctx.status = 200;
      ctx.body = { message: 'Voluntario eliminado con éxito' };
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });

module.exports = router;