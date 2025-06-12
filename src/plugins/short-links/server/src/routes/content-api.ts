export default [
  {
    method: 'POST',
    path: '/short',
    handler: 'controller.fetchGrades',
    config: {
      policies: [],
    },
  },
];
