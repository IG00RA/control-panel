module.exports = {
  routes: [
    {
      method: "GET",
      path: "/certificates/:id",
      handler: "certificate.findOne",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
