import QRCode from 'qrcode';
import axios from 'axios';
import { generateCertificateHtml } from './generateCertificateHtml';
import path from 'path';

interface StrapiContext {
  request: {
    body: any;
  };
  params: {
    id?: string;
  };
  send: (data: any) => void;
  response: {
    status?: number;
    body?: any;
  };
}

interface CertificateInput {
  uuid?: string;
  fullName: string;
  streamNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  tariff: string | null;
  grades: any;
  averageGradePoints: number | null;
  averageGradePercentages: number | null;
  recommendationsMentor: string;
  recommendationsCurator: string;
  videoReview: string;
  qrCode?: string;
  caseLink: string;
  pdfPath?: string;
  gender?: 'male' | 'female' | null;
  certStatus?: 'valid' | 'discontinued' | 'cancelled' | null;
}

type CertificateUpdateInput = Omit<CertificateInput, 'uuid'>;

export default {
  async generateUuid(ctx: StrapiContext) {
    try {
      const generateRandomId = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        return result;
      };

      let newUuid;
      let isUnique = false;

      while (!isUnique) {
        newUuid = generateRandomId();
        const existingCertificates = await strapi.entityService.findMany(
          'api::certificate.certificate',
          {
            filters: { uuid: newUuid },
          }
        );
        if (existingCertificates.length === 0) {
          isUnique = true;
        }
      }

      return ctx.send({ uuid: newUuid });
    } catch (error) {
      console.error('Error generating UUID:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Failed to generate UUID' };
      return;
    }
  },

  async fetchGrades(ctx: StrapiContext) {
    const { telegramId } = ctx.request.body;
    const googleSheetsScriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;
    try {
      const response = await axios.get(`${googleSheetsScriptUrl}?telegramId=${telegramId}`);
      const grades = response.data;
      return ctx.send(grades);
    } catch (error) {
      console.error('Error fetching grades:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Failed to fetch grades' };
      return;
    }
  },

  async generateQrCode(ctx: StrapiContext) {
    const { uuid } = ctx.request.body;
    const url = `https://mustage.team/uk/${uuid}`;
    const qrCodePath = path.resolve(__dirname, `../../../public/uploads/qr_${uuid}.png`);
    try {
      await QRCode.toFile(qrCodePath, url);
      const qrCodeUrl = `/uploads/qr_${uuid}.png`;
      return ctx.send({ qrCode: qrCodeUrl });
    } catch (error) {
      console.error('Error generating QR code:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Failed to generate QR code' };
      return;
    }
  },
  async create(ctx: StrapiContext) {
    const data = ctx.request.body.data as CertificateInput;
    try {
      // Зберігаємо дані напряму, без виклику calculateAverages
      const certificate = await strapi.entityService.create('api::certificate.certificate', {
        data: { ...data },
      });
      return ctx.send(certificate);
    } catch (error) {
      console.error('Error creating certificate:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Error creating certificate' };
      return;
    }
  },

  async generatePdf(ctx) {
    const certificateData = ctx.request.body;

    try {
      const htmlContent = generateCertificateHtml(certificateData);

      // Make sure puppeteer is properly imported only on the server side
      const puppeteer = require('puppeteer');

      const browser = await puppeteer.launch({
        headless: 'new', // Use the new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfPath = `./public/uploads/cert_${certificateData.uuid}.pdf`;
      await page.pdf({
        path: pdfPath,
        width: '842px',
        height: '595px',
        printBackground: true,
      });

      await browser.close();

      const pdfUrl = `/uploads/cert_${certificateData.uuid}.pdf`;
      return ctx.send({ pdfUrl });
    } catch (error) {
      console.error('Error generating PDF:', error);
      ctx.response.status = 500;
      return ctx.send({ error: 'Failed to generate PDF' });
    }
  },
};
