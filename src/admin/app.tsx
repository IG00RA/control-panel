import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: ["ru"],
    translations: {
      ru: {
        "pdf-reader.plugin.name": "Просмотр PDF резюме",
        "certificate-generator.plugin.name": "Создание сертификата",
        "content-manager.plugin.name": "Управление контентом",
        "cloud.plugin.name": "Облако",
        "app.error": "Ошибка",
        "app.error.message": "Ошибка",
        "app.error.copy": "Ошибка",
        "app.components.HomePage.community.links.github": "ГитХаб",
        "app.components.HomePage.community.links.discord": "Дискорд",
        "app.components.HomePage.community.links.reddit": "reddit",
        "app.components.HomePage.community.links.twitter": "twitter",
        "app.components.HomePage.community.links.forum": "forum",
        "app.components.HomePage.community.links.blog": "Blog",
        "app.components.HomePage.community.links.career": "We are hiring!",
        "global.localeToggle.label": "Перевод",
        "review-workflows.plugin.name": "Review Workflows",
        "global.plugins.pdf-reader": "Просмотр PDF резюме",
        "global.plugins.pdf-reader.description": "Просмотр PDF резюме",
        "global.plugins.certificate-generator": "Создание сертификата",
        "global.plugins.certificate-generator.description":
          "Создание сертификата",
        "global.plugins.strapi-cloud": "cloud",
        "global.plugins.strapi-cloud.description": "cloud",
        "global.plugins.strapi-import-export": "Import Export",
        "global.plugins.strapi-import-export.description": "Import Export",
        "Settings.review-workflows.list.page.title": "Review Workflows",
        "Settings.review-workflows.list.page.subtitle":
          "Manage your content review process",
        "Settings.review-workflows.not-available":
          "Review Workflows is only available as part of a paid plan. Upgrade to create and manage workflows.",
        "Settings.sso.subTitle":
          "Configure the settings for the Single Sign-On feature.",
        "app.components.LeftMenuLinkContainer.settings": "Настройки",
        certificate: "Сертификат",
        consumable: "consumable",
        "main-page-element": "main-page-element",
        tariff: "tariff",
        user: "user",
        vacancy: "vacancy",
        "app.components.Select.placeholder": "Select",
        "global.strapi-author": "Автор",
        "global.strapi-editor": "Редактор",
        "global.strapi-super-admin": "Super Admin",
        "users-permissions.List.button.roles": "Добавить роль",
        Certificate: "Certificate",
        "Consumables (Landings)": "Consumables (Landings)",
        "Main page elements (Vacancy)": "Main page elements (Vacancy)",
        "Tariffs (Landings)": "Tariffs (Landings)",
        User: "User",
        Vacancies: "Vacancies",
        "Displayed_price (Landings)": "Displayed_price (Landings)",
        "content-manager.content-types.api::certificate.certificate.id": "id",
        "content-manager.content-types.api::certificate.certificate.uuid":
          "uuid",
        "content-manager.content-types.api::certificate.certificate.fullName":
          "fullName",
        "content-manager.content-types.api::certificate.certificate.streamNumber":
          "streamNumber",
        "content-manager.content-types.api::consumable.consumable.id": "id",
        "content-manager.content-types.api::consumable.consumable.uuid": "uuid",
        "content-manager.content-types.api::consumable.consumable.fullName":
          "fullName",
        "content-manager.content-types.api::consumable.consumable.streamNumber":
          "streamNumber",
        "content-manager.containers.list.table-headers.status": "status",
        "i18n.list-view.table.header.label": "Доступно в",
        "content-manager.content-types.api::consumable.consumable.createdAt":
          "createdAt",
        "content-manager.content-types.api::consumable.consumable.updatedAt":
          "updatedAt",
        "content-manager.content-types.api::consumable.consumable.key": "key",
        "content-manager.content-types.api::main-page-element.main-page-element.id":
          "id",
        "content-manager.content-types.api::main-page-element.main-page-element.createdAt":
          "createdAt",
        "content-manager.content-types.api::main-page-element.main-page-element.updatedAt":
          "updatedAt",
        "content-manager.content-types.api::main-page-element.main-page-element.key":
          "key",
        "content-manager.content-types.api::certificate.certificate.startDate":
          "startDate",
        "content-manager.content-types.api::certificate.certificate.endDate":
          "endDate",
        "content-manager.content-types.api::certificate.certificate.tariff":
          "tariff",
        "content-manager.content-types.api::certificate.certificate.grades":
          "grades",
        "content-manager.content-types.api::certificate.certificate.averageGradePoints":
          "averageGradePoints",
        "content-manager.content-types.api::certificate.certificate.averageGradePercentages":
          "averageGradePercentages",
        "content-manager.content-types.api::certificate.certificate.recommendationsMentor":
          "recommendationsMentor",
        "content-manager.content-types.api::certificate.certificate.recommendationsCurator":
          "recommendationsCurator",
        "content-manager.content-types.api::certificate.certificate.videoReview":
          "videoReview",
        "content-manager.content-types.api::certificate.certificate.caseLink":
          "caseLink",
        "content-manager.content-types.api::certificate.certificate.pdfPath":
          "pdfPath",
        "content-manager.content-types.api::certificate.certificate.gender":
          "gender",
        "content-manager.content-types.api::certificate.certificate.certStatus":
          "certStatus",
        "content-manager.content-types.api::certificate.certificate.telegramId":
          "telegramId",
        "content-manager.content-types.api::certificate.certificate.tgNick":
          "tgNick",
        "content-manager.content-types.api::main-page-element.main-page-element.Hero1stBlockHeader":
          "Hero1stBlockHeader",
        "content-manager.content-types.api::main-page-element.main-page-element.Hero1stBlock":
          "Hero1stBlock",
        "content-manager.content-types.api::main-page-element.main-page-element.Hero2ndBlockHeader":
          "Hero2ndBlockHeader",
        "content-manager.content-types.api::tariff.tariff.id": "id",
        "content-manager.content-types.api::tariff.tariff.Hero1stBlockHeader":
          "Hero1stBlockHeader",
        "content-manager.content-types.api::tariff.tariff.Hero1stBlock":
          "Hero1stBlock",
        "content-manager.content-types.api::tariff.tariff.Hero2ndBlockHeader":
          "Hero2ndBlockHeader",
        "content-manager.content-types.api::tariff.tariff.key": "key",
        "content-manager.content-types.api::tariff.tariff.Name": "Name",
        "content-manager.content-types.api::tariff.tariff.Price": "Price",
        "content-manager.content-types.api::vacancy.vacancy.id": "id",
        "content-manager.content-types.api::vacancy.vacancy.key": "key",
        "content-manager.content-types.api::vacancy.vacancy.Name": "Name",
        "content-manager.content-types.api::vacancy.vacancy.Price": "Price",
        "content-manager.content-types.api::vacancy.vacancy.Title": "Title",
        "content-manager.content-types.api::vacancy.vacancy.Description":
          "Description",
        "content-manager.content-types.api::vacancy.vacancy.createdAt":
          "createdAt",
        "content-manager.content-types.api::vacancy.vacancy.DescriptionFull":
          "DescriptionFull",
        "content-manager.content-types.api::vacancy.vacancy.Skills": "Skills",
        "content-manager.content-types.api::vacancy.vacancy.Requirements":
          "Requirements",
        "content-manager.content-types.api::vacancy.vacancy.Responsibilities":
          "Responsibilities",
        "content-manager.content-types.api::vacancy.vacancy.Advantages":
          "Advantages",
        "content-manager.content-types.api::vacancy.vacancy.YouTubeID":
          "YouTubeID",
        "content-manager.components.vacancy.skill.Skill": "Skill",
        "content-manager.components.vacancy.requirements.Requirement":
          "Requirement",
        "content-manager.components.vacancy.responsibility.Responsibility":
          "Responsibility",
        "content-manager.components.vacancy.advantages.Advantage": "Advantage",
        "content-manager.content-types.api::displayed-price.displayed-price.Displayed_price":
          "Displayed_price",
        "content-manager.content-types.api::tariff.tariff.TariffsItems":
          "TariffsItems",
        "content-manager.content-types.api::tariff.tariff.Price_USD":
          "Price_USD",
        "content-manager.content-types.api::main-page-element.main-page-element.Hero2dBlock":
          "Hero2dBlock",
        "content-manager.content-types.api::main-page-element.main-page-element.MainYoutubeVideoID":
          "MainYoutubeVideoID",
        "content-manager.content-types.api::consumable.consumable.Name": "Name",
        "content-manager.content-types.api::consumable.consumable.Price":
          "Price",
        "content-manager.content-types.api::consumable.consumable.Price_USD":
          "Price_USD",
        "api::certificate.certificate": "Certificate",
        "api::consumable.consumable": "Расходники",
        "api::main-page-element.main-page-element":
          "Main page elements (Vacancy)",
        "api::tariff.tariff": "Tariffs (Landings)",
        "plugin::users-permissions.user": "Пользователи",
        "api::vacancy.vacancy": "Вакансии",
        "api::displayed-price.displayed-price": "Displayed_price (Landings)",
        "prices.consumables-item": "ConsumablesItem",
        "prices.tariffs-item": "TariffsItem",
        "vacancy.advantages": "Advantages",
        "vacancy.requirements": "Requirements",
        "vacancy.responsibilities-short": "ResponsibilitiesShort",
        "vacancy.responsibility": "Responsibility",
        "vacancy.skill": "Skill",
        "": "",
        "": "",
        "": "",
      },
    },
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
