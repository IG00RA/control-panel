import axios from "axios";

module.exports = {
  async sendMessage(ctx) {
    try {
      const { message } = ctx.request.body;

      const chatId = process.env.ANALYTIC_CHAT_ID;

      const url = `https://api.telegram.org/bot${process.env.ANALYTIC_BOT_TOKEN}/sendMessage`;

      await axios.post(url, {
        chat_id: chatId,
        parse_mode: "html",
        text: message,
      });

      ctx.send({ success: true });
    } catch (error) {
      ctx.throw(500, "Failed to send message");
    }
  },
  async sendExtendedMessage(ctx) {
    try {
      // Extract form data
      const { message, name, surname, messenger, phone, items } =
        ctx.request.body;

      // Extract query params
      const queryParams = {
        refId: ctx.query.ref_id,
        sub1: ctx.query.sub1,
        sub2: ctx.query.sub2,
        sub3: ctx.query.sub3,
        sub4: ctx.query.sub4,
        sub5: ctx.query.sub5,
        sub6: ctx.query.sub6,
        sub7: ctx.query.sub7,
        sub8: ctx.query.sub8,
        fbp: ctx.query.fbp,
      };

      // Get referrer or default
      const url = ctx.request.header.referer || "Не вказано";

      // Build message
      let botMessage = `<b>${message || "Немає повідомлення"}</b>\n`;
      botMessage += `Імя: <b>${name || "Не вказано"}</b>\n`;
      botMessage += `Прізвище: <b>${surname || "Не вказано"}</b>\n`;
      botMessage += `Месенджер: <b>${messenger || "Не вказано"}</b>\n`;
      botMessage += `Телефон: <b>${phone || "Не вказано"}</b>\n`;
      botMessage += `Url: <b>${url}</b>\n`;

      // Add items if present
      if (items && Array.isArray(items) && items.length > 0) {
        botMessage += `\n<b>Товари:</b>\n`;
        items.forEach((item, index) => {
          botMessage += `${index + 1}. Колір: <b>${
            item.color || "Не вказано"
          }</b>, Кількість: <b>${item.quantity || 0}</b>\n`;
        });
      }

      // Add query parameters
      const paramMessage = Object.entries(queryParams)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: <b>${value}</b>`)
        .join("\n");

      if (paramMessage) {
        botMessage += `\n${paramMessage}`;
      }

      // Send to Telegram
      const telegramUrl = `https://api.telegram.org/bot${process.env.ANALYTIC_BOT_TOKEN}/sendMessage`;

      await axios.post(telegramUrl, {
        chat_id: process.env.ANALYTIC_CHAT_ID,
        parse_mode: "html",
        text: botMessage,
      });

      ctx.send({ success: true });
    } catch (error) {
      console.error("Error sending extended message:", error);
      ctx.throw(500, "Failed to send extended message: " + error.message);
    }
  },
};
