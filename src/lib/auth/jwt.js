var jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config();

function getJWTScope(token) {
    const secret = process.env.JWT_SECRET;
    var payload = jwt.verify(token, secret);
    return payload.scope;
}

async function isUser(ctx, next) {
    await next();
    var token = ctx.request.header.authorization.split(' ')[1];
    var { userId, scope } = getJWTInfo(token);
    console.log("ID del usuario:", userId);
    console.log("Alcance del token:", scope);
    ctx.assert(scope.includes('user'), 403, "No eres un usuario.");
}

module.exports = {
    isUser
};