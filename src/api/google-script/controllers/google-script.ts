import axios from "axios";

module.exports = {
  async sendToGoogleScript(ctx) {
    try {
      const url = process.env.GOOGLE_SCRIPT_URL;
      await axios.post(url, ctx.request.body);
      ctx.send({ success: true });
    } catch (error) {
      ctx.throw(500, "Failed to send data to Google Script");
    }
  },
};
