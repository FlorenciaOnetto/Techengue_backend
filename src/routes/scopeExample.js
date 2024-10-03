const Router = require('koa-router')
const { createContext } = require('react')
const authUtils = require('../lib/auth/jwt.js')

const router = new Router()

router.get('/protecteduser', authUtils.isUser, async (ctx) => {
    ctx.body = {
        message: "Bienvenido a la ruta protegida con el scope user!", 
        user: ctx.state.user
    } 
});

module.exports = router;