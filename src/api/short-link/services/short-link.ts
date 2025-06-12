import { factories } from "@strapi/strapi";
import { nanoid } from "nanoid";

export default factories.createCoreService(
  "api::short-link.short-link",
  ({ strapi }) => ({
    async createShortLink(params, originalUrl, user) {
      const shortCode = nanoid(7);

      const shortLink = await strapi.entityService.create(
        "api::short-link.short-link",
        {
          data: {
            shortCode,
            parameters: params,
            originalUrl,
            createdByUser: user?.id?.toString() || "anonymous",
          },
        }
      );

      return {
        shortCode,
        shortUrl: `https://spreadsheets.mustage.team/${shortCode}`,
        parameters: params,
      };
    },

    async getParametersByCode(shortCode) {
      const shortLink = await strapi.entityService.findMany(
        "api::short-link.short-link",
        {
          filters: { shortCode },
        }
      );

      if (!shortLink || shortLink.length === 0) {
        throw new Error("Short link not found");
      }

      return shortLink[0].parameters;
    },
  })
);
