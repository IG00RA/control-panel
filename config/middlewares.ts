export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  // {
  //   name: "strapi::cors",
  //   config: {
  //     enabled: true,
  //     origin: [
  //       "http://localhost:1337",
  //       "https://admin.mustage.team",
  //       "https://verify.mustage.team",
  //       "https://academy.mustage.team",
  //       "https://mustage.team",
  //     ],
  //     credentials: true,
  //   },
  // },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
