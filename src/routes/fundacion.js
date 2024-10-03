const Router = require("koa-router");

const router = new Router();

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

router.post('fundacion.crear_fundacion','/crear_fundacion', async (ctx) => {
  try {
    const authInfo = ctx.request.body;
    console.log('se creo la fundacion')
    const fundacion = await ctx.orm.Fundacion.create({
      user_id: authInfo.user_id,
      descripcion : authInfo.descripcion,
      contacto: authInfo.contacto,
      sitio_web: authInfo.sitio_web
    });

    ctx.body = fundacion;
    ctx.status = 201;
  } catch (error) {
    console.log('no se creo la fundacion')
    ctx.body = error;
    ctx.status = 400;
  }
});

router.get('fundacion.show', '/datos_fundacion/:id', async (ctx) => {
  try {
    console.log('Endpoint fundacion.show alcanzado');
    const fundacion = await ctx.orm.Fundacion.findOne({ where: { id: ctx.params.id } });

    if (!fundacion) {
      ctx.status = 404;
      ctx.body = { message: 'Fundación no encontrada' };
      return;
    }

    ctx.body = fundacion;
    ctx.status = 200;
  } catch (error) {
    console.error('Error en el endpoint fundacion.show:', error);
    ctx.body = error;
    ctx.status = 500; // Internal Server Error
  }
});

router.get('fundacion.list', '/', async (ctx) => {
    try {
      const fundaciones = await ctx.orm.Fundacion.findAll();
      ctx.body = fundaciones;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});



router.put('fundacion.update', '/:id', async (ctx) => {
    try {
      const { descripcion, contacto, sitio_web } = ctx.request.body;
      const fundacion = await ctx.orm.Fundacion.findByPk(ctx.params.id);

      if (!fundacion) {
        ctx.status = 404;
        ctx.body = { error: 'Fundación no encontrada' };
        return;
      }

      fundacion.descripcion = descripcion;
      fundacion.contacto = contacto;
      fundacion.sitio_web = sitio_web;
      await fundacion.save();

      ctx.body = fundacion;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});

router.get('fundacion.show', '/get_por_userID/:user_id', async (ctx) => {
  try {

    const fundacion = await ctx.orm.Fundacion.findOne({
      where: { user_id: ctx.params.user_id }
    });

    if (!fundacion) {
      ctx.status = 404;
      ctx.body = { error: 'Fundación no encontrada' };
      return;
    }

    ctx.body = fundacion;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});


router.put('fundacion.update', '/update_por_userID/:user_id', async (ctx) => {
  try {
    const { descripcion, contacto, sitio_web } = ctx.request.body;

    const fundacion = await ctx.orm.Fundacion.findOne({
      where: { user_id: ctx.params.user_id }
    });

    if (!fundacion) {
      ctx.status = 404;
      ctx.body = { error: 'Fundación no encontrada' };
      return;
    }

    fundacion.descripcion = descripcion;
    fundacion.contacto = contacto;
    fundacion.sitio_web = sitio_web;
    await fundacion.save();

    ctx.body = fundacion;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});




router.delete('fundacion.delete', '/:id', async (ctx) => {
  try {
    const fundacion = await ctx.orm.Fundacion.findByPk(ctx.params.id);

    if (!fundacion) {
      ctx.status = 404;
      ctx.body = { message: 'Fundación no encontrada' };
      return;
    }

    await fundacion.destroy();

    ctx.status = 200;
    ctx.body = { message: 'Fundación eliminada con éxito' };
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

router.delete('fundacion.delete', '/borrar/:user_id', async (ctx) => {
  try {
    const fundacion = await ctx.orm.Fundacion.findOne({
      where: { user_id: ctx.params.user_id }
    });

    if (!fundacion) {
      ctx.status = 404;
      ctx.body = { message: 'Fundación no encontrada' };
      return;
    }

    await fundacion.destroy();

    ctx.status = 200;
    ctx.body = { message: 'Fundación eliminada con éxito' };
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
