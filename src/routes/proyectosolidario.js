const Router = require("koa-router");

const router = new Router();

router.put('proyecto.update', '/:id', async (ctx) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_finalizacion, objetivos } = ctx.request.body;
    const proyecto = await ctx.orm.ProyectoSolidario.findByPk(ctx.params.id);

    if (!proyecto) {
      ctx.status = 404;
      ctx.body = { error: 'Proyecto Solidario no encontrado' };
      return;
    }

    proyecto.titulo = titulo;
    proyecto.descripcion = descripcion;
    proyecto.fecha_inicio = fecha_inicio;
    proyecto.fecha_finalizacion = fecha_finalizacion;
    proyecto.objetivos = objetivos;
    await proyecto.save();

    ctx.body = proyecto;
    ctx.status = 200;
  } catch (error) {
    console.error('Error updating project:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor al actualizar el proyecto' };
  }
});

router.get('proyecto.list', '/', async (ctx) => {
  try {
    const proyectos = await ctx.orm.ProyectoSolidario.findAll();
    ctx.body = proyectos;
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching projects:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor al recuperar proyectos' };
  }
});

router.post('proyecto.create', '/', async (ctx) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_finalizacion, objetivos, categoria, proyect_userId } = ctx.request.body;

    // Validar que todos los campos necesarios estén presentes
    if (!titulo || !descripcion || !fecha_inicio || !fecha_finalizacion || !objetivos || !categoria || !proyect_userId) {
      ctx.throw(400, 'Todos los campos son obligatorios');
    }

    // Resto del código para crear el proyecto, incluyendo el userId
    const proyecto = await ctx.orm.ProyectoSolidario.create({
      titulo,
      descripcion,
      fecha_inicio,
      fecha_finalizacion,
      objetivos,
      categoria,
      proyect_userId, // Agregar el userId
    });

    ctx.body = { proyecto };
    ctx.status = 201;
  } catch (error) {
    console.error('Error creating project:', error);
    ctx.status = error.status || 500;
    ctx.body = { error: error.message || 'Error interno del servidor al crear el proyecto' };
  }
});

router.get('proyecto.show', '/:id', async (ctx) => {
  try {
    const proyecto = await ctx.orm.ProyectoSolidario.findByPk(ctx.params.id);

    if (!proyecto) {
      ctx.status = 404;
      ctx.body = { message: 'Proyecto Solidario no encontrado' };
      return;
    }

    ctx.body = proyecto;
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching project:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor al recuperar el proyecto' };
  }
});

router.get('proyecto.show', '/id_user/:proyect_userId', async (ctx) => {
  try {
    const proyectos = await ctx.orm.ProyectoSolidario.findAll({
      where: { proyect_userId: ctx.params.proyect_userId },
    });

    if (!proyectos || proyectos.length === 0) {
      ctx.status = 404;
      ctx.body = { message: 'Proyectos Solidarios no encontrados' };
      return;
    }

    ctx.body = proyectos;
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching projects:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor al recuperar los proyectos' };
  }
});



router.delete('proyecto.delete', '/:id', async (ctx) => {
  try {
    const proyecto = await ctx.orm.ProyectoSolidario.findByPk(ctx.params.id);

    if (!proyecto) {
      ctx.status = 404;
      ctx.body = { message: 'Proyecto Solidario no encontrado' };
      return;
    }

    await proyecto.destroy();

    ctx.status = 200;
    ctx.body = { message: 'Proyecto Solidario eliminado con éxito' };
  } catch (error) {
    console.error('Error deleting project:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error interno del servidor al eliminar el proyecto' };
  }
});

module.exports = router;
