import axios from 'axios';
import { generateCertificateHtml } from './generateCertificateHtml';

interface ContextOfStrapi {
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

export default {
  async findByTelegramId(ctx: ContextOfStrapi) {
    const { searchTelegramId } = ctx.request.body;
    console.log('searchTelegramId2', searchTelegramId);

    if (!searchTelegramId) {
      ctx.response.status = 400;
      return ctx.send({ error: 'Telegram ID is required' });
    }

    try {
      const certificates = await strapi.entityService.findMany('api::certificate.certificate', {
        filters: { telegramId: searchTelegramId },
      });

      if (certificates.length > 0) {
        return ctx.send(certificates[0]); // Повертаємо перший знайдений сертифікат
      } else {
        ctx.response.status = 404;
        return ctx.send(null); // Повертаємо null, якщо сертифікат не знайдено
      }
    } catch (error) {
      console.error('Error finding certificate by Telegram ID:', error);
      ctx.response.status = 500;
      return ctx.send({ error: 'Failed to find certificate' });
    }
  },

  async generateUuid(ctx: ContextOfStrapi) {
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

  async fetchGrades(ctx: ContextOfStrapi) {
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

  async generatePdf(ctx: ContextOfStrapi) {
    const certificateData = ctx.request.body as CertificateInput;

    try {
      const pdfUrl = `/uploads/${certificateData.uuid}/Certificate_${certificateData.uuid}.pdf`;
      const certificate = await strapi.entityService.create('api::certificate.certificate', {
        data: { ...certificateData, pdfPath: pdfUrl },
      });

      const htmlContent = generateCertificateHtml(certificateData);
      const puppeteer = require('puppeteer');
      const fs = require('fs');
      const path = require('path');

      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const uploadDir = `./public/uploads/${certificateData.uuid}`;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      } else {
        console.log(`Директорія вже існує: ${uploadDir}`);
      }

      const pdfPath = path.join(uploadDir, `Certificate_${certificateData.uuid}.pdf`);
      await page.pdf({
        path: pdfPath,
        width: '842px',
        height: '595px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        scale: 1.5,
      });

      console.log(`PDF збережено за шляхом: ${pdfPath}`);

      const numPages = 7;
      const imageUrls = [];
      await page.setViewport({
        width: 842,
        height: 595,
        deviceScaleFactor: 1.2,
      });

      for (let i = 1; i <= numPages; i++) {
        const imagePath = path.join(uploadDir, `img_${certificateData.uuid}_page${i}.jpeg`);
        await page.screenshot({
          path: imagePath,
          type: 'jpeg',
          quality: 100,
          clip: {
            x: 0,
            y: (i - 1) * 595,
            width: 842,
            height: 595,
          },
        });
        imageUrls.push(
          `/uploads/${certificateData.uuid}/img_${certificateData.uuid}_page${i}.jpeg`
        );
      }

      await browser.close();

      return ctx.send({ pdfUrl, imageUrls, certificateId: certificate.id });
    } catch (error: any) {
      console.error('Помилка при генерації або збереженні PDF:', error);

      if (error.name === 'ValidationError' && error.details?.errors) {
        const errorDetails = error.details.errors[0]; // Беремо першу помилку
        const field = errorDetails.path[0]; // Отримуємо назву поля (наприклад, "telegramId")
        const message = `Поле ${field} має бути унікальним`; // Формуємо конкретне повідомлення

        ctx.response.status = 400;
        return ctx.send({
          error: {
            name: error.name,
            message,
            details: error.details,
          },
        });
      }

      ctx.response.status = 500;
      return ctx.send({
        error: {
          name: error.name || 'ServerError',
          message: error.message || 'Не вдалося згенерувати або зберегти PDF',
        },
      });
    }
  },

  async updateCertificate(ctx) {
    const { id } = ctx.params;
    const updatedData = ctx.request.body;

    try {
      // Оновлюємо дані в базі
      const updatedCertificate = await strapi.entityService.update(
        'api::certificate.certificate',
        id,
        { data: updatedData }
      );

      // Перегенеруємо PDF з оновленими даними
      const htmlContent = generateCertificateHtml(updatedCertificate);
      const puppeteer = require('puppeteer');
      const fs = require('fs');
      const path = require('path');

      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      // Визначення абсолютного шляху до директорії
      const uploadDir = `./public/uploads/${updatedCertificate.uuid}`;

      // Перевірка та створення директорії, якщо вона не існує
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      } else {
        console.log(`Директорія вже існує: ${uploadDir}`);
      }

      // Шлях до PDF-файлу
      const pdfPath = path.join(uploadDir, `Certificate_${updatedCertificate.uuid}.pdf`);
      await page.pdf({
        path: pdfPath,
        width: '842px',
        height: '595px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        scale: 1.5,
      });

      const numPages = 7;
      const imageUrls = [];
      await page.setViewport({
        width: 842,
        height: 595,
        deviceScaleFactor: 1.2,
      });

      // Генерація зображень
      for (let i = 1; i <= numPages; i++) {
        const imagePath = path.join(uploadDir, `img_${updatedCertificate.uuid}_page${i}.jpeg`);
        await page.screenshot({
          path: imagePath,
          type: 'jpeg',
          quality: 100,
          clip: {
            x: 0,
            y: (i - 1) * 595,
            width: 842,
            height: 595,
          },
        });
        imageUrls.push(
          `/uploads/${updatedCertificate.uuid}/img_${updatedCertificate.uuid}_page${i}.jpeg`
        );
      }

      await browser.close();

      // Коректний шлях до PDF у відповіді
      const pdfUrl = `/uploads/${updatedCertificate.uuid}/Certificate_${updatedCertificate.uuid}.pdf`;
      return ctx.send({ pdfUrl });
    } catch (error) {
      console.error('Помилка при оновленні сертифіката:', error);
      ctx.response.status = 500;
      return ctx.send({ error: 'Не вдалося оновити сертифікат' });
    }
  },
};
