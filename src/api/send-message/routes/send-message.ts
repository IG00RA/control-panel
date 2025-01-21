module.exports = {
  routes: [
    {
      method: "POST",
      path: "/send-message",
      handler: "send-message.sendMessage",
      config: {
        policies: [],
        middlewares: [
          async (ctx, next) => {
            const ALLOWED_ORIGINS = JSON.parse(process.env.ALLOWED_ORIGINS);
            const origin = ctx.request.header.origin;

            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
              await next();
            } else {
              ctx.throw(403, "Not allowed by CORS");
            }
          },
        ],
        auth: false,
      },
    },
  ],
};
