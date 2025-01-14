export default [
  {
    method: 'GET',
    path: '/files',
    handler: 'controller.getFiles',
    config: {
      policies: [],
      auth: false,
    },
  },
];
