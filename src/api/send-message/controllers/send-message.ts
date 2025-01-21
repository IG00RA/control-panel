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
};
