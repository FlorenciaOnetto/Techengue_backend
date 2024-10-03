const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const router = new Router();

router.post("authentication.signup", "/signup", async (ctx) => {
    const authInfo = ctx.request.body;
    let user = await ctx.orm.User.findOne({ where: { mail: authInfo.mail } })
    if (user) {
        ctx.body = `El usuario con email '${authInfo.mail}' ya existe.`;
        ctx.status = 400;
        return;
    }
    try {
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(authInfo.contrasena, saltRounds);

        user = await ctx.orm.User.create({
            nombre: authInfo.nombre,
            tipo: authInfo.tipo,
            nombre_usuario: authInfo.nombre_usuario,
            mail: authInfo.mail,
            contrasena: hashPassword,
            foto: authInfo.foto
        })
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    ctx.body = {
        nombre_usuario: user.nombre_usuario,
        mail: user.mail
    };
    ctx.status = 201;
    ctx.body = `El usuario se creó correctamente.`;
})

router.post("authentication.login", "/login", async (ctx) => {
    let user;
    const authInfo = ctx.request.body
    try {
        user = await ctx.orm.User.findOne({ where:{mail:authInfo.mail}});
    }
    catch (error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    if (!user) {
        ctx.body = `El usuario con email '${authInfo.mail} no fue encontrado.'`;
        ctx.status = 400;
        return;
    }

    const validPassword = await bcrypt.compare(authInfo.contrasena, user.contrasena);

    if (validPassword) {
        ctx.body = {
            mail: authInfo.mail,
            contrasena: authInfo.contrasena,
        };
        ctx.status = 200;
    } else {
        console.log("Dentro del else")
        ctx.body = "Contraseña Incorrecta";
        ctx.status = 400;
        return;
    }
    // Creamos el JWT.
    const expirationSeconds = 1 * 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    var token = jwt.sign(
        { scope: ['user'] },
        JWT_PRIVATE_KEY,
        { subject: user.id.toString() },
        { expiresIn: expirationSeconds }
    );
    ctx.body = {
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": expirationSeconds,
    }
    ctx.status = 200;
})

router.get("user.getByMail", "/user/:mail", async (ctx) => {
    const userMail = ctx.params.mail;

    try {
      const user = await ctx.orm.User.findOne({ where: { mail: userMail } });

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: `No se encontró un usuario con email '${userMail}'.` };
        return;
      }

      ctx.status = 200;
      ctx.body = { tipo: user.tipo };
      console.body = { tipo: user.tipo }
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
});

router.get("user.getByMail", "/user/getFundacionID/:mail", async (ctx) => {
    const userMail = ctx.params.mail;

    try {
      const user = await ctx.orm.User.findOne({ where: { mail: userMail } });

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: `No se encontró un usuario con email '${userMail}'.` };
        return;
      }

      ctx.status = 200;
      ctx.body = { fundacion: user.fundacion };
      console.body = { fundacion: user.fundacion }
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
});

router.get("user.getByMail", "/user/getDatosUser/:mail", async (ctx) => {
    const userMail = ctx.params.mail;

    try {
      const user = await ctx.orm.User.findOne({ where: { mail: userMail } });

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: `No se encontró un usuario con email '${userMail}'.` };
        return;
      }

      ctx.status = 200;
      ctx.body = { nombre: user.nombre, foto: user.foto, nombre_usuario: user.nombre_usuario, mail: user.mail };
      console.body = { fundacion: user.fundacion }
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
});

router.put("user.update", "/:id", async (ctx) => {
    let user;
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
    const expirationSeconds = 1 * 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    var token = jwt.sign(
        { scope: ['user'] },
        JWT_PRIVATE_KEY,
        { subject: user.id.toString() },
        { expiresIn: expirationSeconds }
    );
    ctx.body = {
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": expirationSeconds,
    }
    ctx.status = 200;
});



module.exports = router;
