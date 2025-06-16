import type { Core } from '@strapi/strapi';
import { nanoid } from 'nanoid';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async shortLink(ctx) {
    try {
      const { data } = ctx.request.body;

      if (!data?.parameters || !data?.originalUrl) {
        return ctx.badRequest('Parameters and originalUrl are required');
      }

      const shortCode = nanoid(7);

      const createData = {
        shortCode,
        originalUrl: data.originalUrl,
        parameters: data.parameters,
        createdByUserId: data.createdByUser || ctx.state.user?.id?.toString() || 'unknown',
        publishedAt: new Date(),
      };

      await strapi.entityService.create('api::short-link.short-link', {
        data: createData,
      });

      return ctx.send({
        shortUrl: `${data.originalUrl}/${shortCode}`,
      });
    } catch (error: any) {
      console.error('Error in shortLink controller:', error);
      if (error.name === 'ValidationError' && error.details?.errors) {
        const errorDetails = error.details.errors[0];
        const field = errorDetails.path[0];
        const message = `Поле ${field} имеет некорректное значение или должно быть уникальным`;
        return ctx.badRequest(message, {
          error: error.name,
          details: errorDetails,
        });
      }
      return ctx.badRequest('Error creating short link', {
        error: error.message,
        stack: error.stack,
      });
    }
  },

  async getParameters(ctx) {
    try {
      const { shortCode } = ctx.params;

      const shortLinks = await strapi.entityService.findMany('api::short-link.short-link', {
        filters: {
          shortCode: shortCode,
        },
      });

      if (!shortLinks || !shortLinks.length) {
        return ctx.notFound('Short link not found or not published');
      }

      return ctx.send({
        originalUrl: shortLinks[0].originalUrl,
        parameters: shortLinks[0].parameters,
      });
    } catch (error: any) {
      console.error('Error in getParameters controller:', error);
      return ctx.badRequest('Error retrieving parameters', {
        error: error.message,
        stack: error.stack,
      });
    }
  },
});

export default controller;
