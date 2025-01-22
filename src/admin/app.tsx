import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: ["ru", "uk"],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);

    const style = document.createElement("style");
    style.innerHTML = `
          nav ul li a[href="/admin"],
      nav ul li a[href="/admin/plugins/upload"],
      nav ul li a[href="/admin/plugins/cloud"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  },
};
