import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
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
  response: {
    status?: number;
    body?: any;
  };
}

// Оновлений інтерфейс для вхідних даних сертифіката
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

// Тип для оновлення, який виключає uuid
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
    const qrCodePath = `./public/uploads/qr_${uuid}.png`;
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

  async generatePdf(ctx: StrapiContext) {
    const uuid = ctx.params.id; // Отримуємо uuid з URL
    const certificateData = ctx.request.body as CertificateInput;

    // Перевіряємо, чи є запис з таким uuid
    let certificate;
    try {
      const existingCertificates = await strapi.entityService.findMany(
        'api::certificate.certificate',
        {
          filters: { uuid },
        }
      );
      certificate = existingCertificates[0]; // Беремо перший запис, якщо є

      const certificateInput: CertificateUpdateInput = {
        fullName: certificateData.fullName,
        streamNumber: certificateData.streamNumber,
        startDate: certificateData.startDate,
        endDate: certificateData.endDate,
        tariff: certificateData.tariff,
        grades: certificateData.grades,
        averageGradePoints: certificateData.averageGradePoints,
        averageGradePercentages: certificateData.averageGradePercentages,
        recommendationsMentor: certificateData.recommendationsMentor,
        recommendationsCurator: certificateData.recommendationsCurator,
        videoReview: certificateData.videoReview,
        qrCode: certificateData.qrCode,
        caseLink: certificateData.caseLink,
        pdfPath: certificateData.pdfPath,
        gender: certificateData.gender,
        certStatus: certificateData.certStatus,
      };

      if (certificate) {
        certificate = await strapi.entityService.update(
          'api::certificate.certificate',
          certificate.id,
          {
            data: certificateInput as any,
          }
        );
      } else {
        certificate = await strapi.entityService.create('api::certificate.certificate', {
          data: {
            ...certificateInput,
            uuid: certificateData.uuid,
          } as any,
        });
      }
    } catch (error) {
      console.error('Error saving certificate data:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Error saving certificate data' };
      return;
    }

    // Генерація PDF
    const pdfPath = `./public/uploads/cert_${certificate.uuid}.pdf`;
    const doc = new PDFDocument({ size: 'A4' });
    doc.font('Helvetica');

    const writeStream = createWriteStream(pdfPath);
    doc.pipe(writeStream);

    try {
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);

        doc.fontSize(16).text(`Certificate for ${certificate.fullName || 'N/A'}`, 100, 100);
        doc.fontSize(12).text(`Stream: ${certificate.streamNumber || 'N/A'}`, 100, 120);
        doc.text(`Tariff: ${certificate.tariff || 'N/A'}`, 100, 140);
        doc.text(
          `Period: ${certificate.startDate || 'N/A'} - ${certificate.endDate || 'N/A'}`,
          100,
          160
        );
        doc.text(`Gender: ${certificate.gender || 'N/A'}`, 100, 180);
        doc.text(`Status: ${certificate.certStatus || 'N/A'}`, 100, 200);
        doc.text(`Average Points: ${certificate.averageGradePoints || 'N/A'}`, 100, 220);
        doc.text(`Average Percentage: ${certificate.averageGradePercentages || 'N/A'}%`, 100, 240);
        doc.text(
          `Mentor Recommendations: ${certificate.recommendationsMentor || 'N/A'}`,
          100,
          260,
          { width: 400 }
        );
        doc.text(
          `Curator Recommendations: ${certificate.recommendationsCurator || 'N/A'}`,
          100,
          340,
          { width: 400 }
        );
        doc.text(`Video Review: ${certificate.videoReview || 'N/A'}`, 100, 420);
        doc.text(`Case Link: ${certificate.caseLink || 'N/A'}`, 100, 440);

        if (certificate.qrCode) {
          doc.image(`./public${certificate.qrCode}`, 400, 100, { width: 100 });
        }

        doc.end();
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Error generating PDF' };
      return;
    }

    const pdfUrl = `/uploads/cert_${certificate.uuid}.pdf`;
    try {
      await strapi.entityService.update('api::certificate.certificate', certificate.id, {
        data: { pdfPath: pdfUrl } as any,
      });
    } catch (error) {
      console.error('Error updating certificate with PDF path:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Error updating certificate with PDF path' };
      return;
    }

    return ctx.send({ pdfPath: pdfUrl });
  },

  async create(ctx: StrapiContext) {
    const data = ctx.request.body.data as CertificateInput;
    try {
      const averages = await strapi.service('api::certificate.certificate').calculateAverages(data);
      const certificate = await strapi.entityService.create('api::certificate.certificate', {
        data: { ...data, ...averages } as any,
      });
      return ctx.send(certificate);
    } catch (error) {
      console.error('Error creating certificate:', error);
      ctx.response.status = 500;
      ctx.response.body = { error: 'Error creating certificate' };
      return;
    }
  },
};
