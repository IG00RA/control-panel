import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: ["ru", "uk"],
  },
  bootstrap(app: StrapiApp) {
    const style = document.createElement("style");
    const editorStyles = `
  .ql-container {
    background-color: rgb(33, 33, 52) !important; /* Темний фон редактора */
    color: #ffffff !important; /* Колір тексту */
    border: none; /* Прибираємо стандартний бордер */
  }
  .ql-editor::before {
    color: #a1a1b3 !important; /* Колір плейсхолдера */
    font-style: normal; /* Прибираємо курсив, якщо потрібно */
  }
  .ql-toolbar.ql-snow {
    background-color: rgb(22, 22, 34) !important; /* Темний фон панелі інструментів */
    border: none; /* Прибираємо стандартний бордер */
  }
  .ql-toolbar.ql-snow .ql-formats button,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label {
    color: #ffffff !important; /* Колір елементів управління */
  }
  .ql-toolbar.ql-snow .ql-formats button:hover,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label:hover,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-item:hover {
    color: #6b6bef !important; /* Колір при наведенні */
  }
  .ql-snow .ql-picker-options {
    background-color: rgb(33, 33, 52)  !important; /* Темний фон випадаючого списку */
    color: #ffffff !important; /* Колір тексту в списку */
  }
      `;

    style.innerHTML = `
        nav ul li a[href="/admin"],
        nav ul li a[href="/admin/plugins/upload"],
        nav ul li a[href="/admin/plugins/cloud"] {
          display: none !important;
        }
        ${editorStyles}
      `;
    document.head.appendChild(style);
  },
};
