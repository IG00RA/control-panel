export default [
  {
    method: 'POST',
    path: '/short',
    handler: 'controller.shortLink',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/short/:shortCode',
    handler: 'controller.getParameters',
    config: {
      policies: [],
      auth: false,
    },
  },
];
