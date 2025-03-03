export default [
  {
    method: 'GET',
    path: '/generate-uuid',
    handler: 'certificate.generateUuid',
     config: {
      policies: [],
      auth: false,
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
    path: '/generate-qr',
    handler: 'certificate.generateQrCode',
     config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/generate-pdf/:id',
    handler: 'certificate.generatePdf',
     config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/create',
    handler: 'certificate.create',
     config: {
      policies: [],
      auth: false,
    },
  },
];
