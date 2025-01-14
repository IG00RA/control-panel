import { google } from 'googleapis';
import path from 'path';
import type { Core } from '@strapi/strapi';

const authenticateGoogleDrive = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), '/private/key.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
};

const listPdfFiles = async (folderId: string) => {
  const drive = authenticateGoogleDrive();
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/pdf'`,
      fields: 'files(id, name, webViewLink)',
    });
    return res.data.files || [];
  } catch (error) {
    throw new Error('Failed to fetch files from Google Drive');
  }
};

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx) {
    ctx.body = strapi.plugin('pdf-reader').service('service').getWelcomeMessage();
  },

  async getFiles(ctx) {
    const folderId = '12i7akVg8_ZmCg1v2p5QRPsmVFL0C0Tjj';
    try {
      const files = await listPdfFiles(folderId);
      ctx.send({ files });
    } catch (error) {
      ctx.throw(500, 'Failed to fetch files from Google Drive', { error });
    }
  },
});

export default controller;
