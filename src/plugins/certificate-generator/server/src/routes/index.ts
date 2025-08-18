export default [
  {
    method: 'GET',
    path: '/generate-uuid',
    handler: 'certificate.generateUuid',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/fetch-grades',
    handler: 'certificate.fetchGrades',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/generate-pdf',
    handler: 'certificate.generatePdf',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/update-pdf/:id',
    handler: 'certificate.updateCertificate',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/find-by-telegram-id',
    handler: 'certificate.findByTelegramId',
    config: {
      policies: [],
    },
  },
];
