const Router = require("koa-router");

const router = new Router();


router.get('chat.list', '/', async (ctx) => {
    try {
      const chats = await ctx.orm.Chat.findAll();
      ctx.body = chats;
      ctx.status = 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  });

router.get('chat.show', '/:id', async (ctx) => {
  const { id } = ctx.params;
  const chat = await ctx.orm.Chat.findByPk(id);
  if (chat) {
    ctx.body = chat;
    ctx.status = 200;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Chat no encontrado' };
  }
});  
  

router.post('chat.create', '/', async (ctx) => {
    try {
      const { FechaInicio } = ctx.request.body;
      const chat = await ctx.orm.Chat.create({ FechaInicio });
      ctx.body = chat;
      ctx.status = 201;
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
});
  

router.put('chat.update', '/:id', async (ctx) => {
  try {
    const { FechaInicio } = ctx.request.body;
    const chat = await ctx.orm.Chat.findByPk(ctx.params.id);

    if (!chat) {
      ctx.status = 404;
      ctx.body = { error: 'Chat no encontrado' };
      return;
    }

    chat.FechaInicio = FechaInicio;
    await chat.save();

    ctx.body = chat;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});
  

module.exports = router;