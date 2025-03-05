"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::certificate.certificate",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params; // Отримуємо параметр із URL (тепер це буде uuid)

      // Використовуємо Document Service API для пошуку за uuid
      const entity = await strapi
        .documents("api::certificate.certificate")
        .findFirst({
          filters: {
            uuid: id, // Шукаємо за полем uuid
          },
        });

      if (!entity) {
        return ctx.notFound("Certificate not found");
      }

      // Санітизуємо та повертаємо результат
      return entity;
    },
  })
);
