import { randomUUID } from 'crypto';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs'; // Використовуємо синхронний createWriteStream
import axios from 'axios';

// Інтерфейс для типізації контексту Strapi
interface StrapiContext {
  request: {
    body: any;
  };
  params: {
    id?: string;
  };
  send: (data: any) => void;
}

export default {
  // Генерація унікального UUID
  async generateUuid(ctx) {
    try {
      // Шукаємо останній запис із найбільшим значенням uuid у базі
      const lastCertificate = await strapi.entityService.findMany('api::certificate.certificate', {
        sort: { uuid: 'desc' }, // Сортуємо за спаданням, щоб отримати найбільший uuid
        pagination: { limit: 1 }, // Отримуємо лише один запис
      });

      let newUuid: number;

      if (lastCertificate.length > 0 && lastCertificate[0].uuid) {
        // Якщо є записи в базі, беремо останній uuid і додаємо 1
        newUuid = parseInt(lastCertificate[0].uuid, 10) + 1;
      } else {
        // Якщо база порожня, починаємо з базового значення
        newUuid = 18648515;
      }

      // Повертаємо новий uuid як рядок
      return ctx.send({ uuid: newUuid.toString() });
    } catch (error) {
      // Обробка помилок
      console.error('Error generating UUID:', error);
      ctx.status = 500;
      return ctx.send({ error: 'Failed to generate UUID' });
    }
  },

  // Отримання оцінок із Google Sheets
  fetchGrades: async (ctx: StrapiContext) => {
    const { telegramId } = ctx.request.body;
    const googleSheetsScriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;
    const response = await axios.get(`${googleSheetsScriptUrl}?telegramId=${telegramId}`);
    const grades = response.data;
    return ctx.send(grades);
  },

  // Генерація QR-коду
  generateQrCode: async (ctx: StrapiContext) => {
    const { uuid } = ctx.request.body;
    const url = `https://mustage.team/uk/${uuid}`;
    const qrCodePath = `./public/uploads/qr_${uuid}.png`;
    await QRCode.toFile(qrCodePath, url);
    const qrCodeUrl = `/uploads/qr_${uuid}.png`;
    return ctx.send({ qrCode: qrCodeUrl });
  },

  // Генерація PDF
  generatePdf: async (ctx: StrapiContext) => {
    const { id } = ctx.params;
    const certificate = await strapi.entityService.findOne(
      'plugin::certificate-generator.certificate',
      id!
    );

    const pdfPath = `./public/uploads/cert_${certificate.uuid}.pdf`;
    const doc = new PDFDocument();

    // Використовуємо createWriteStream напряму
    const writeStream = createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Обгортаємо завершення PDF у проміс
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);

      doc.text(`Certificate for ${certificate.fullName}`, 100, 100);
      doc.text(`Stream: ${certificate.streamNumber}`, 100, 120);
      doc.text(`Tariff: ${certificate.tariff}`, 100, 140);
      if (certificate.qrCode) {
        doc.image(`./public${certificate.qrCode}`, 400, 100, { width: 100 });
      }

      doc.end();
    });

    const pdfUrl = `/uploads/cert_${certificate.uuid}.pdf`;
    await strapi.entityService.update('plugin::certificate-generator.certificate', id!, {
      data: { pdfPath: pdfUrl } as any,
    });

    return ctx.send({ pdfPath: pdfUrl });
  },
  // Створення сертифіката
  create: async (ctx: StrapiContext) => {
    const data = ctx.request.body.data;
    const averages = await strapi
      .service('plugin::certificate-generator.certificate')
      .calculateAverages(data);
    const certificate = await strapi.entityService.create(
      'plugin::certificate-generator.certificate',
      {
        data: { ...data, ...averages },
      }
    );
    return ctx.send(certificate);
  },
};
