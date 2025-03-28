export function generateCertificateHtml(certificateData) {
  // Допоміжні функції
  const formatPeriod = (startDate: string, endDate: string) => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const formatTariff = (tariff: string) => {
    const tariffMap = {
      free: 'Free',
      start: 'Start',
      base: 'Base',
      pro: 'Pro',
    };
    return `"${tariffMap[tariff] || 'Unknown'}"`;
  };

  const getGradeData = (lessonNumber: string) => {
    if (!certificateData?.grades?.lessons) return { tests: '-', homework: '-' };

    const lessonData = certificateData.grades.lessons.find(
      (lesson) => lesson.lesson === lessonNumber
    );

    if (!lessonData) return { tests: '-', homework: '-' };

    const tests = lessonData.tests
      ? lessonData.tests.length > 0
        ? `${lessonData.tests[0]}%`
        : '-'
      : '-';
    const homework = lessonData.homework
      ? lessonData.homework.length > 0
        ? lessonData.homework.join('; ')
        : '-'
      : '-';

    return { tests, homework };
  };

  // Динамічні значення
  const period = formatPeriod(certificateData.startDate, certificateData.endDate);
  const format = formatTariff(certificateData.tariff);

  const courseCompletionText =
    certificateData.gender === 'male'
      ? 'пройшов курс “Арбітраж трафіку” від команди Mustage Team'
      : certificateData.gender === 'female'
      ? 'пройшла курс “Арбітраж трафіку” від команди Mustage Team'
      : 'пройшов(ла) курс “Арбітраж трафіку” від команди Mustage Team';

  // HTML-шаблон
  return `<!DOCTYPE html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>
      Сертифікат про закінчення навчального курсу від команди Mustage Team
    </title>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        box-sizing: border-box;
      }
      html {
        box-sizing: border-box;
        scroll-behavior: smooth;
      }
      body {
        background-color: #f5f5f5;
        font-family: "Montserrat", sans-serif;
        margin: 0;
        padding: 0;
      }

      *,
      *::after,
      *::before {
        box-sizing: inherit;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p {
        margin: 0;
      }

      ul {
        margin: 0;
        padding: 0;
      }

      li {
        list-style: none;
        text-decoration: none;
      }

      a {
        text-decoration: none;
      }

      button {
        padding: 0;
        font-family: inherit;
        background-color: transparent;
        border: none;
        cursor: pointer;
      }

      img {
        display: block;
        height: auto;
      }

      .certificate_block {
        position: relative;
        padding: 55px 70px 50px;
        width: 842px;
        height: 595px;
        min-width: 842px;
        min-height: 595px;
        background-color: #fff;
        background-image: url("http://localhost:1337/certImg/certificate.webp");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        page-break-after: always; /* Розрив сторінки після кожного блоку */
      }
      .certificate_block:last-child {
        page-break-after: auto; /* Останній блок без розриву */
      }
      .certificate_block_main {
        padding: 55px 18px 50px;
      }
      .certificate_header {
        color: #000;
        font-size: 22px;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 8px;
        text-align: center;
      }
      .certificate_id {
        color: #000;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 40px;
      }
      .certificate_name_text {
        color: #000;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .certificate_name {
        color: #000;
        font-size: 56px;
        font-weight: 600;
        text-align: center;
        white-space: nowrap;
        margin-bottom: 8px;
      }
      .certificate_name_bottom_text {
        margin: 0 auto;
        max-width: 355px;
        margin-bottom: 40px;
        color: #000;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
      }
      .period_wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 24px;
        margin-bottom: 16px;
      }
      .certificate_thread,
      .certificate_period {
        color: #000;
        font-size: 14px;
        font-weight: 400;
      }
      .certificate_thread span,
      .certificate_period span {
        padding-left: 6px;
        font-weight: 600;
      }
      .certificate_format {
        color: #000;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 25px;
      }
      .certificate_format span {
        padding-left: 6px;
        font-weight: 600;
      }
      .certificate_bottom_wrap {
        display: flex;
        gap: 260px;
        align-items: center;
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
      }
      .certificate_qr {
        padding: 8px;
        border-radius: 24px;
        border: 1px solid #d4d4d4;
      }
      .qr_code {
        width: 128px;
        height: 128px;
      }
      .certificate_seo_wrap {
        width: 315px;
        display: flex;
        gap: 13px;
        align-items: center;
      }
      .certificate_seo_text {
        flex-shrink: 0;
        color: #000;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        max-width: 150px;
      }
      .certificate_seo_text span {
        font-weight: 600;
      }
      .certificate_stamp_wrap {
        position: relative;
        flex-shrink: 0;
      }
      .stamp {
        width: 150px;
        height: 150px;
      }
      .certificate_stamp_id {
        z-index: 1;
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 75px;
        color: #88a4d6;
        text-align: center;
        font-size: 7.5px;
        font-weight: 700;
        text-shadow: -1px -1px 0 #fdfdfd, -1px 1px 0 #fdfdfd, 1px -1px 0 #fdfdfd,
          1px 1px 0 #fdfdfd;
      }
      .sign {
        z-index: 2;
        position: absolute;
        top: 50%;
        left: 54%;
        transform: translate(-50%, -50%);
        width: 105px;
        height: auto;
      }
      .supplement_header {
        color: #000;
        font-size: 22px;
        font-weight: 600;
        text-transform: uppercase;
        text-align: center;
        margin-bottom: 8px;
      }
      .supplement_id {
        color: #000;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 40px;
      }
      .supplement_student,
      .supplement_thread,
      .supplement_period,
      .supplement_format {
        color: #000;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 8px;
      }
      .supplement_student span,
      .supplement_thread span,
      .supplement_period span,
      .supplement_format span {
        padding-left: 4px;
        font-weight: 600;
      }
      .supplement_format {
        margin-bottom: 40px;
      }
      .supplement_curator_text {
        margin-bottom: 16px;
        color: #000;
        font-size: 14px;
        font-weight: 600;
      }
      .supplement_text {
        color: #000;
        font-size: 12px;
        font-weight: 400;
        line-height: 150%;
      }
      .supplement_seo_wrap {
        position: absolute;
        bottom: 45px;
        right: 70px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .supplement_seo_text {
        max-width: 150px;
        color: #000;
        font-size: 14px;
        font-weight: 400;
      }
      .supplement_seo_text span {
        font-weight: 600;
      }
      .card_header {
        color: #000;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .report_table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      .table_header {
        text-align: left;
        color: #000;
        font-size: 11px;
        font-weight: 600;
        padding: 8px 16px;
        border: 1px solid #88a4d6;
      }
      .table_header span {
        white-space: nowrap;
      }
      .first_column {
        width: 432px;
        color: #000;
        font-size: 11px;
        font-weight: 400;
        padding: 8px 16px;
        border: 1px solid #88a4d6;
      }
      .second_column {
        width: 117px;
        color: #000;
        font-size: 11px;
        font-weight: 500;
        padding: 8px 16px;
        border: 1px solid #88a4d6;
      }
      .third_column {
        width: 148px;
        color: #000;
        font-size: 11px;
        font-weight: 500;
        padding: 8px 16px;
        border: 1px solid #88a4d6;
      }
      .notion_link {
        color: #000;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 16px;
      }
      .notion_link a {
        padding-right: 4px;
        font-weight: 600;
        color: #000;
      }
      .case_link {
           margin-bottom: -4px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 52ch;
}
      .notion_link_video {
        color: #000;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 40px;
      }
      .notion_link_video a {
        padding-right: 4px;
        font-weight: 600;
        color: #000;
      }
      .average_grade {
        color: #000;
        font-size: 16px;
        font-weight: 400;
      }
      .average_grade span {
        padding-right: 4px;
        font-weight: 600;
      }
      .notion_link_wrap {
        margin-bottom: 40px;
      }

      .video_wrap {
        position: relative;
        width: 486px;
        height: 265px;
        border-radius: 13px;
        background: #d9d9d9;
        margin-bottom: 24px;
      }

      .video_icon {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        width: 64px;
        height: 64px;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border-radius: 50%;
      }

      .video_box {
  overflow: hidden;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
                border: none;
       border-radius: 13px;
       
      }

      .video_icon_img {
        width: 64px;
        height: 64px;
      }
    </style>
  </head>
  <body>
    <div class="certificate_block certificate_block_main">
      <h2 class="certificate_header">
        Сертифікат про закінчення навчального курсу
      </h2>
      <p class="certificate_id">
        Certificate ID: <span>${certificateData.uuid || 'N/A'}</span>
      </p>
      <p class="certificate_name_text">Цей документ підтверджує, що</p>
      <h2 class="certificate_name">${certificateData.fullName || 'N/A'}</h2>
      <p class="certificate_name_bottom_text">${courseCompletionText}</p>
      <div class="period_wrap">
        <p class="certificate_thread">
          Потік №: <span>${certificateData.streamNumber || 'N/A'}</span>
        </p>
        <p class="certificate_period">
          Період навчання: <span>${period}</span>
        </p>
      </div>
      <p class="certificate_format">Формат навчання: <span>${format}</span></p>
      <div class="certificate_bottom_wrap">
        <div class="certificate_qr">
          <img
            src="http://localhost:1337/certImg/qr.webp"
            alt="Mustage qr code"
            class="qr_code"
          />
        </div>
        <div class="certificate_seo_wrap">
          <p class="certificate_seo_text">
            <span>Денис Панкратов</span> СЕО Mustage Team
          </p>
          <div class="certificate_stamp_wrap">
            <img
              src="http://localhost:1337/certImg/stamp.webp"
              alt="Mustage stamp"
              class="stamp"
            />
            <p class="certificate_stamp_id">
              Certificate ID: <span>${certificateData.uuid || 'N/A'}</span>
            </p>
            <img
              src="http://localhost:1337/certImg/seo_sign.webp"
              alt="SEO sign"
              class="sign"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="certificate_block">
      <div>
        <h2 class="supplement_header">Додаток до сертифікату</h2>
        <p class="supplement_id">
          Certificate ID: <span>${certificateData.uuid || 'N/A'}</span>
        </p>
        <p class="supplement_student">
          Студент: <span>${certificateData.fullName || 'N/A'}</span>
        </p>
        <p class="supplement_thread">
          Потік №: <span>${certificateData.streamNumber || 'N/A'}</span>
        </p>
        <p class="supplement_period">Період навчання: <span>${period}</span></p>
        <p class="supplement_format">Формат навчання: <span>${format}</span></p>
        <h3 class="supplement_curator_text">
          Характеристика та рекомендації від куратора курсу:
        </h3>
        <p class="supplement_text">
          ${certificateData.recommendationsCurator || 'N/A'}
        </p>
      </div>
      <div class="supplement_seo_wrap">
        <p class="supplement_seo_text">
          <span>Максим Язвінський</span> Куратор курсу
        </p>
        <div class="certificate_stamp_wrap">
          <img
            src="http://localhost:1337/certImg/stamp.webp"
            alt="Mustage stamp"
            class="stamp"
          />
          <p class="certificate_stamp_id">
            Certificate ID: <span>${certificateData.uuid || 'N/A'}</span>
          </p>
          <img
            src="http://localhost:1337/certImg/curator_sign.webp"
            alt="Curator sign"
            class="sign"
          />
        </div>
      </div>
    </div>

    <div class="certificate_block">
      <div>
        <h3 class="supplement_curator_text">
          Характеристика та рекомендації від наставника курсу:
        </h3>
        <p class="supplement_text">
          ${certificateData.recommendationsMentor || 'N/A'}
        </p>
      </div>
      <div class="supplement_seo_wrap">
        <p class="supplement_seo_text">
          <span>Дмитро Вартанян</span> Наставник курсу
        </p>
        <div class="certificate_stamp_wrap">
          <img
            src="http://localhost:1337/certImg/stamp.webp"
            alt="Mustage stamp"
            class="stamp"
          />
          <p class="certificate_stamp_id">
            Certificate ID: <span>${certificateData.uuid || 'N/A'}</span>
          </p>
          <img
            src="http://localhost:1337/certImg/mentor_sign.webp"
            alt="Mentor sign"
            class="sign"
          />
        </div>
      </div>
    </div>

    <div class="certificate_block">
      <h2 class="card_header">Табель успішності:</h2>
      <table class="report_table">
        <thead>
          <tr>
            <th class="table_header">Назва уроку</th>
            <th class="table_header">
              Оцінка за тест <span>(0-12 балів)</span>
            </th>
            <th class="table_header">
              Оцінка за домашнє завдання <span>(0-12 балів)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="first_column">Урок 0.1 “Знайомство з курсом”</td>
            <td class="second_column">${getGradeData('0.1').tests}</td>
            <td class="third_column">${getGradeData('0.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 1.1 “19 порад арбітражникам-початківцям”
            </td>
            <td class="second_column">${getGradeData('1.1').tests}</td>
            <td class="third_column">${getGradeData('1.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 1.2 “Що таке арбітраж, які є гравці в цій ніші, вертикалі, за
              що платить рекламодавець у ніші гемблінгу, як рекламодавець оцінює
              трафік”
            </td>
            <td class="second_column">${getGradeData('1.2').tests}</td>
            <td class="third_column">${getGradeData('1.2').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 1.3 “Термінологія в арбітражі трафіку”
            </td>
            <td class="second_column">${getGradeData('1.3').tests}</td>
            <td class="third_column">${getGradeData('1.3').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 1.4 “Вибір гео та офферу, на що звертати увагу”
            </td>
            <td class="second_column">${getGradeData('1.4').tests}</td>
            <td class="third_column">${getGradeData('1.4').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 1.5 “Як зареєструватися на Binance та переказати гроші”
            </td>
            <td class="second_column">${getGradeData('1.5').tests}</td>
            <td class="third_column">${getGradeData('1.5').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 2.1 “Що таке антидетект браузер. Встановлення антидетект
              браузера на комп'ютер”
            </td>
            <td class="second_column">${getGradeData('2.1').tests}</td>
            <td class="third_column">${getGradeData('2.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 2.2 “Що таке проксі? Де взяти проксі, як купити (мобільні
              проксі), як їх завести в антик”
            </td>
            <td class="second_column">${getGradeData('2.2').tests}</td>
            <td class="third_column">${getGradeData('2.2').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 2.3 “Покупка облікових записів. Передача в долфін та завод з
              куків”
            </td>
            <td class="second_column">${getGradeData('2.3').tests}</td>
            <td class="third_column">${getGradeData('2.3').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 2.4 “Облік розхідників у гугл таблицях”
            </td>
            <td class="second_column">${getGradeData('2.4').tests}</td>
            <td class="third_column">${getGradeData('2.4').homework}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="certificate_block">
      <h2 class="card_header">Табель успішності:</h2>
      <table class="report_table">
        <thead>
          <tr>
            <th class="table_header">Назва уроку</th>
            <th class="table_header">
              Оцінка за тест <span>(0-12 балів)</span>
            </th>
            <th class="table_header">
              Оцінка за домашнє завдання <span>(0-12 балів)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="first_column">
              Урок 2.5 “Ще трохи про облік. Масовий імпорт акаунтів у долфін”
            </td>
            <td class="second_column">${getGradeData('2.5').tests}</td>
            <td class="third_column">${getGradeData('2.5').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 3.1 “Огляд рекламного кабінету Фейсбук. Відмінність ads
              manager від business manager”
            </td>
            <td class="second_column">${getGradeData('3.1').tests}</td>
            <td class="third_column">${getGradeData('3.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 3.2 “Платежки для арбітражу трафіку. Прив'язка картки до
              білінгу”
            </td>
            <td class="second_column">${getGradeData('3.2').tests}</td>
            <td class="third_column">${getGradeData('3.2').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 3.3 “Як розшарувати прилки на рекламні кабінети”
            </td>
            <td class="second_column">${getGradeData('3.3').tests}</td>
            <td class="third_column">${getGradeData('3.3').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 3.4 “Види чеків у фейсбуці (ризики, ЗРД, поліси тощо)”
            </td>
            <td class="second_column">${getGradeData('3.4').tests}</td>
            <td class="third_column">${getGradeData('3.4').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 4.1 “Правила креативів, що конвертують. Підходи до створення
              креативів”
            </td>
            <td class="second_column">${getGradeData('4.1').tests}</td>
            <td class="third_column">${getGradeData('4.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 4.2 “Як дивитися рекламу конкурентів Facebook? Огляд
              spy-сервісу ADHEART”
            </td>
            <td class="second_column">${getGradeData('4.2').tests}</td>
            <td class="third_column">${getGradeData('4.2').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 4.3 “Як і де замовити креативи. Складання ТЗ та замовлення
              креативів”
            </td>
            <td class="second_column">${getGradeData('4.3').tests}</td>
            <td class="third_column">${getGradeData('4.3').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 5.1 “Що таке лінківка і навіщо вона потрібна?”
            </td>
            <td class="second_column">${getGradeData('5.1').tests}</td>
            <td class="third_column">${getGradeData('5.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 5.2 “Лінкування саморегів до личків”
            </td>
            <td class="second_column">${getGradeData('5.2').tests}</td>
            <td class="third_column">${getGradeData('5.2').homework}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="certificate_block">
      <h2 class="card_header">Табель успішності:</h2>
      <table class="report_table">
        <thead>
          <tr>
            <th class="table_header">Назва уроку</th>
            <th class="table_header">
              Оцінка за тест <span>(0-12 балів)</span>
            </th>
            <th class="table_header">
              Оцінка за домашнє завдання <span>(0-12 балів)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="first_column">
              Урок 5.3 “Лінкування саморегів у бізнес менеджери”
            </td>
            <td class="second_column">${getGradeData('5.3').tests}</td>
            <td class="third_column">${getGradeData('5.3').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 5.4 “Що робити, якщо не створюється бізнес-менеджер?”
            </td>
            <td class="second_column">${getGradeData('5.4').tests}</td>
            <td class="third_column">${getGradeData('5.4').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 5.5 “Як додати рекламний кабінет у бізнес-менеджер?
              Лінкування саморегів у кінгу”
            </td>
            <td class="second_column">${getGradeData('5.5').tests}</td>
            <td class="third_column">${getGradeData('5.5').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 6.1 “Запуск реклами на гемблінг програми. Розбір детального
              націлення”
            </td>
            <td class="second_column">${getGradeData('6.1').tests}</td>
            <td class="third_column">${getGradeData('6.1').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 6.2 “Як отримати код від фейсбука без номера телефону? Огляд
              сервісу для прийому смс”
            </td>
            <td class="second_column">${getGradeData('6.2').tests}</td>
            <td class="third_column">${getGradeData('6.2').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 6.3 “Проходження чеків. 1 частина”
            </td>
            <td class="second_column">${getGradeData('6.3').tests}</td>
            <td class="third_column">${getGradeData('6.3').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 6.4 “Що робити, якщо летять ризики? Як зробити препей акаунти
              ФБ”
            </td>
            <td class="second_column">${getGradeData('6.4').tests}</td>
            <td class="third_column">${getGradeData('6.4').homework}</td>
          </tr>
          <tr>
            <td class="first_column">
              Урок 6.5 “Аналіз рекламних кампаній та трафіку. Проходження чеків
              2 частина”
            </td>
            <td class="second_column">${getGradeData('6.5').tests}</td>
            <td class="third_column">${getGradeData('6.5').homework}</td>
          </tr>
          <tr>
            <td class="first_column">Урок 7.1 “Робота з Fbtool”</td>
            <td class="second_column">${getGradeData('7.1').tests}</td>
            <td class="third_column">${getGradeData('7.1').homework}</td>
          </tr>
        </tbody>
      </table>
      ${
        certificateData.tariff === 'pro' || certificateData.tariff === 'base'
          ? `
      <p class="notion_link">
        Підсумковий проєкт (кейс):
        <a
        class="case_link"
          href="${certificateData.caseLink}"
          target="_blank"
          rel="noopener noreferrer"
          >${certificateData.caseLink}</a
        >
      </p>
      <p class="average_grade">
        Середній бал за курс: <span>${certificateData.averageGradePoints}</span>
      </p>
      `
          : ''
      }
    </div>

    <div class="certificate_block">
      ${
        certificateData.tariff === 'pro' || certificateData.tariff === 'base'
          ? `
      <div class="notion_link_wrap">
        <h2 class="card_header">Відеовідгук від СЕО курса:</h2>
        <div class="video_wrap">
  <img
      src="https://img.youtube.com/vi/${certificateData.videoReview}/hqdefault.jpg"
      alt="Прев'ю відео відгуку"
      class="video_box"
    />
          <a
            class="video_icon"
            href="https://www.youtube.com/watch?v=${certificateData.videoReview}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="http://localhost:1337/certImg/play.webp"
              alt="Mustage play icon"
              class="video_icon_img"
          /></a>
        </div>
      </div>
      `
          : `
      <div class="notion_link_wrap">
        <p class="notion_link_video">
          Підсумковий проєкт (кейс):
          <a
            href="${certificateData.caseLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="case_link"
            >${certificateData.caseLink}</a
          >
        </p>
        <p class="average_grade">
          Середній бал за курс:
          <span>${certificateData.averageGradePoints}</span>
        </p>
      </div>
      `
      }

      <p class="academy_text">
        З повагою, <br />
        <span>Академія Mustage Team</span>
      </p>

      <div class="supplement_seo_wrap">
        <p class="certificate_seo_text">
          <span>Денис Панкратов</span> СЕО Mustage Team
        </p>
        <div class="certificate_stamp_wrap">
          <img
            src="http://localhost:1337/certImg/stamp.webp"
            alt="Mustage stamp"
            class="stamp"
          />
          <p class="certificate_stamp_id">
            Certificate ID: <span>${certificateData.uuid || 'N/A'}</span>
          </p>
          <img
            src="http://localhost:1337/certImg/seo_sign.webp"
            alt="sign"
            class="sign"
          />
        </div>
      </div>
    </div>
  </body>
</html>
`;
}
