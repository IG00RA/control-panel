import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::short-link.short-link",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const { parameters, originalUrl } = ctx.request.body.data;
        const user = ctx.state.user;

        const result = await strapi
          .service("api::short-link.short-link")
          .createShortLink(parameters, originalUrl, user);

        return result;
      } catch (error) {
        ctx.throw(400, error.message);
      }
    },

    async getParameters(ctx) {
      try {
        const { shortCode } = ctx.params;
        const parameters = await strapi
          .service("api::short-link.short-link")
          .getParametersByCode(shortCode);

        return parameters;
      } catch (error) {
        ctx.throw(404, error.message);
      }
    },
  })
);
