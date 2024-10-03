const Router = require("koa-router");

const router = new Router();


router.get("user.list","/",async(ctx)=>{
    try {
        const user = await ctx.orm.User.findAll();
        ctx.body = user;
        ctx.status = 200;
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("user.show", "/id/:id", async (ctx) => {
  try {
      const user = await ctx.orm.User.findOne({ where: { id: ctx.params.id } });

      if (user) {
          ctx.body = user;
          ctx.status = 200;
      } else {
          ctx.status = 404;
          ctx.body = { error: "Usuario no encontrado" };
      }
  } catch (error) {
      ctx.body = error;
      ctx.status = 400;
  }
});

router.get("user.show", "/obtener_por_nombre/:nombre", async (ctx) => {
  try {
      const user = await ctx.orm.User.findOne({ where: { nombre: ctx.params.nombre } });

      if (user) {
          ctx.body = user;
          ctx.status = 200;
      } else {
          ctx.status = 404;
          ctx.body = { error: "Usuario no encontrado" };
      }
  } catch (error) {
      ctx.body = error;
      ctx.status = 400;
  }
});


router.put("user.update", "/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const updatedUserData = ctx.request.body;

      const user = await ctx.orm.User.findOne({ where: { id } });

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: 'Usuario no encontrado' };
        return;
      }

      // Actualiza los campos del usuario con los datos del cuerpo de la solicitud
      user.nombre = updatedUserData.nombre || user.nombre;
      user.nombre_usuario = updatedUserData.nombre_usuario || user.nombre_usuario;
      user.mail = updatedUserData.mail || user.mail;
      user.contrasena = updatedUserData.contrasena || user.contrasena;
      user.foto = updatedUserData.foto || user.foto;
      user.tipo = updatedUserData.tipo || user.tipo;
      user.fundacion = updatedUserData.fundacion || user.fundacion;

      await user.save(); // Guarda los cambios en la base de datos

      ctx.status = 200;
      ctx.body = { message: 'Usuario actualizado con éxito' };
    } catch (error) {
      console.error(error);
      ctx.status = 400;
      ctx.body = { message: 'Error al actualizar el usuario' };
    }
});

router.delete("user.delete", "/:id", async (ctx) => {
    try {
      const { id } = ctx.params;

      console.log("Intentando encontrar al usuario con ID:", id);

      const user = await ctx.orm.User.findOne({ where: { id } });

      if (!user) {
        console.log("Usuario no encontrado con ID:", id);
        ctx.status = 404;
        ctx.body = { message: 'Usuario no encontrado' };
        return;
      }

      console.log("Eliminando usuario con ID:", id);
      await user.destroy(); // Elimina el usuario de la base de datos

      ctx.status = 200;
      ctx.body = { message: 'Usuario eliminado con éxito' };
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      ctx.status = 400;
      ctx.body = { message: 'Error al eliminar el usuario' };
    }
  });



module.exports = router;
