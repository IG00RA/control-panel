import React, { useCallback, useRef, useState, useEffect } from 'react';
import GenerateUuidButton from '../components/GenerateUuidButton';
import FetchGrades from '../components/FetchGrades';
import GeneratePdfButton from '../components/GeneratePdfButton';
import QuillEditor from '../components/QuillEditor';
import InputField from '../components/InputField';
import TariffSelect from '../components/TariffSelect';
import GenderSelect from '../components/GenderSelect';
import StatusSelect from '../components/StatusSelect';
import DatePickerField from '../components/DatePickerField';
import { Button } from '@strapi/design-system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HomePageProps {}

interface Lesson {
  lesson: string;
  tests: number[] | null;
  homework: number[] | null;
}

interface Grades {
  lessons: Lesson[];
}

export interface CertificateData {
  uuid: string | null;
  fullName: string;
  streamNumber: number | null;
  startDate: Date | null;
  endDate: Date | null;
  tariff: string | null;
  telegramId: string;
  tgNick: string;
  grades: Grades | null;
  qrCode: string | null;
  averageGradePoints: number | null;
  averageGradePercentages: number | null;
  recommendationsMentor: string;
  recommendationsCurator: string;
  videoReview: string;
  caseLink: string;
  pdfUrl: string | null;
  gender: 'male' | 'female' | null;
  certStatus: 'valid' | 'discontinued' | 'cancelled' | null;
  certificateId?: string | null;
}

const BASE_URL = process.env.REACT_APP_API_URL || '';

const HomePage: React.FC<HomePageProps> = () => {
  const [data, setData] = useState<CertificateData>({
    uuid: null,
    fullName: '',
    streamNumber: null,
    startDate: null,
    endDate: null,
    tariff: null,
    telegramId: '',
    tgNick: '',
    grades: null,
    qrCode: null,
    averageGradePoints: null,
    averageGradePercentages: null,
    recommendationsMentor: '',
    recommendationsCurator: '',
    videoReview: '',
    caseLink: '',
    pdfUrl: null,
    gender: 'male',
    certStatus: 'valid',
    certificateId: null,
  });

  const [searchTelegramId, setSearchTelegramId] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const fetchGradesResetRef = useRef<(() => void) | null>(null);
  const generateUuidResetRef = useRef<(() => void) | null>(null);
  const generatePdfResetRef = useRef<(() => void) | null>(null);

  const updateData = useCallback((key: keyof CertificateData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTelegramIdChange = (telegramId: string) => {
    setData((prevData) => ({
      ...prevData,
      telegramId,
    }));
  };

  const resetForm = () => {
    const confirmed = window.confirm('Очистити всі введені дані?');
    if (confirmed) {
      setData({
        uuid: null,
        fullName: '',
        streamNumber: null,
        startDate: null,
        endDate: null,
        tariff: null,
        telegramId: '',
        tgNick: '',
        grades: null,
        qrCode: null,
        averageGradePoints: null,
        averageGradePercentages: null,
        recommendationsMentor: '',
        recommendationsCurator: '',
        videoReview: '',
        caseLink: '',
        pdfUrl: null,
        gender: 'male',
        certStatus: 'valid',
        certificateId: null,
      });
      if (fetchGradesResetRef.current) fetchGradesResetRef.current();
      if (generateUuidResetRef.current) generateUuidResetRef.current();
      if (generatePdfResetRef.current) generatePdfResetRef.current();
      setSearchMessage('');
      setIsSearchDisabled(false);
      setSearchTelegramId('');
    }
  };

  const handleSearch = async () => {
    if (!searchTelegramId) {
      setSearchMessage('Будь ласка, введіть Telegram ID');
      return;
    }

    setIsSearchLoading(true);
    try {
      const res = await fetch('/certificate-generator/find-by-telegram-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage?.getItem('jwtToken')?.replace(/['"]+/g, '')}`,
        },
        body: JSON.stringify({ searchTelegramId }),
      });
      if (!res.ok) {
        throw new Error('Не вдалося знайти дані');
      }
      const certificate = await res.json();
      if (certificate) {
        // Використовуємо let замість const, щоб дозволити переназначення
        let startDate = certificate.startDate ? new Date(certificate.startDate) : null;
        let endDate = certificate.endDate ? new Date(certificate.endDate) : null;

        if (startDate && isNaN(startDate.getTime())) {
          startDate = null;
        }
        if (endDate && isNaN(endDate.getTime())) {
          endDate = null;
        }

        setData({
          ...data,
          ...certificate,
          startDate,
          endDate,
          certificateId: certificate.id || null,
          telegramId: searchTelegramId,
          pdfUrl: certificate.pdfPath,
        });
        setSearchMessage('');
        setIsSearchDisabled(true);
        toast.success('Сертифікат успішно знайдено в базі!', {
          autoClose: 3000,
        });
      } else {
        setSearchMessage('Даних не знайдено');
      }
    } catch (error) {
      setSearchMessage('Даних не знайдено');
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    if (searchTelegramId && isSearchDisabled) {
      setIsSearchDisabled(false);
    }
  }, [searchTelegramId]);

  const openPdfInNewTab = () => {
    if (data.pdfUrl) {
      const fullUrl = `${BASE_URL}${data.pdfUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  const styles = {
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#171723',
      minHeight: '100vh',
      color: '#f8f8f9',
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    },
    title: {
      fontSize: '2.2rem',
      marginBottom: '24px',
      fontWeight: 600,
      color: '#fff',
      borderBottom: '1px solid #2e2e45',
      paddingBottom: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '16px',
    },
    card: {
      backgroundColor: '#212134',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      border: '1px solid #2e2e45',
    },
    editor: {
      width: '100%',
      marginTop: '4px',
    },
    dataDisplay: {
      backgroundColor: 'rgb(24, 24, 38)',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '0.9rem',
      overflowX: 'auto' as const,
      color: '#a1a1b3',
      border: '1px solid #2e2e45',
      marginTop: '10px',
    },
    statCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#1c1c30',
      borderRadius: '8px',
      border: '1px solid #2e2e45',
      height: '100%',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#6b6bef',
      marginBottom: '4px',
    },
    label: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: 'rgb(255, 255, 255)',
      marginBottom: '8px',
      display: 'block',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
    },
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Certificate Generator</h1>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div style={styles.grid}>
        <div
          style={{
            gridColumn: 'span 12',
            ...styles.card,
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div>
            <GenerateUuidButton
              onUuidGenerated={(uuid: string) => {
                updateData('uuid', uuid);
                toast.success('UUID успішно згенеровано!', { autoClose: 3000 });
              }}
              onReset={(resetFn) => (generateUuidResetRef.current = resetFn)}
              isDisabled={!!data.certificateId}
            />
            {data.uuid && (
              <div style={styles.dataDisplay}>
                <strong>Згенерований UUID:</strong> {data.uuid}
              </div>
            )}
          </div>
          <span style={styles.label}>Або</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <InputField
              id="searchTelegramId"
              value={searchTelegramId}
              onChange={(value) => setSearchTelegramId(value)}
              placeholder="Введіть Telegram ID"
              style={{ width: '300px' }}
            />
            <Button onClick={handleSearch} disabled={isSearchLoading || isSearchDisabled}>
              {isSearchLoading ? 'Шукаю...' : 'Пошук'}
            </Button>
            {searchMessage && <span style={{ color: '#ff6b6b' }}>{searchMessage}</span>}
          </div>
        </div>

        <InputField
          id="fullName"
          label="Імя та Прізвище"
          value={data.fullName}
          onChange={(value) => updateData('fullName', value)}
          placeholder="Введіть Імя та Прізвище"
          style={{ gridColumn: 'span 4', ...styles.card }}
        />

        <TariffSelect
          value={data.tariff}
          onChange={(value) => updateData('tariff', value)}
          style={{ gridColumn: 'span 4', ...styles.card }}
          labelStyle={styles.label}
        />

        <InputField
          id="streamNumber"
          label="Номер потоку"
          value={data.streamNumber}
          onChange={(value) => updateData('streamNumber', value)}
          placeholder="Введіть номер потоку"
          type="number"
          style={{ gridColumn: 'span 4', ...styles.card }}
        />

        <DatePickerField
          id="startDate"
          label="Дата початку навчання"
          value={data.startDate}
          onChange={(date) => updateData('startDate', date)}
          style={{ gridColumn: 'span 3', ...styles.card }}
          labelStyle={styles.label}
        />

        <DatePickerField
          id="endDate"
          label="Дата завершення навчання"
          value={data.endDate}
          onChange={(date) => updateData('endDate', date)}
          style={{ gridColumn: 'span 3', ...styles.card }}
          labelStyle={styles.label}
        />

        <GenderSelect
          value={data.gender}
          onChange={(value) => updateData('gender', value)}
          style={{ gridColumn: 'span 3', ...styles.card }}
          labelStyle={styles.label}
        />
        <StatusSelect
          value={data.certStatus}
          onChange={(value) => updateData('certStatus', value)}
          style={{ gridColumn: 'span 3', ...styles.card }}
          labelStyle={styles.label}
        />

        <div style={{ gridColumn: 'span 6', ...styles.card }}>
          <label htmlFor="telegramId" style={styles.label}>
            Telegram ID
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <FetchGrades
              onTelegramIdChange={handleTelegramIdChange}
              onGradesFetched={(grades: any) => {
                updateData('tgNick', grades?.homework?.telegramUsername || '');
                const lessons: Lesson[] = [
                  { lesson: '0.1', tests: ['testN1'], homework: [] },
                  { lesson: '1.1', tests: ['testN2'], homework: [] },
                  { lesson: '1.2', tests: ['testN3'], homework: [] },
                  { lesson: '1.3', tests: ['testN4'], homework: [] },
                  { lesson: '1.4', tests: ['testN5'], homework: ['hN2'] },
                  { lesson: '1.5', tests: ['testN7'], homework: ['hN29'] },
                  { lesson: '2.1', tests: ['testN8'], homework: ['hN5'] },
                  { lesson: '2.2', tests: ['testN9'], homework: ['hN7'] },
                  { lesson: '2.3', tests: ['testN10'], homework: ['hN8'] },
                  { lesson: '2.4', tests: ['testN11'], homework: ['hN9'] },
                  { lesson: '2.5', tests: ['testN12'], homework: ['hN10'] },
                  { lesson: '3.1', tests: ['testN13'], homework: [] },
                  { lesson: '3.2', tests: ['testN14'], homework: ['hN11'] },
                  { lesson: '3.3', tests: ['testN15'], homework: ['hN13'] },
                  { lesson: '3.4', tests: ['testN16'], homework: ['hN12'] },
                  { lesson: '4.1', tests: ['testN18'], homework: ['hN19'] },
                  { lesson: '4.2', tests: ['testN19'], homework: ['hN20'] },
                  { lesson: '4.3', tests: ['testN20'], homework: ['hN21', 'hN30'] },
                  { lesson: '5.1', tests: [], homework: [] },
                  { lesson: '5.2', tests: [], homework: ['hN14'] },
                  { lesson: '5.3', tests: [], homework: [] },
                  { lesson: '5.4', tests: [], homework: ['hN15'] },
                  { lesson: '5.5', tests: ['testN17'], homework: ['hN16', 'hN17'] },
                  { lesson: '6.1', tests: [], homework: ['hN22'] },
                  { lesson: '6.2', tests: [], homework: ['hN23'] },
                  { lesson: '6.3', tests: [], homework: ['hN24'] },
                  { lesson: '6.4', tests: [], homework: ['hN25'] },
                  { lesson: '6.5', tests: ['testN21'], homework: ['hN26'] },
                  { lesson: '7.1', tests: ['testN22'], homework: ['hN28'] },
                ].map(({ lesson, tests, homework }) => {
                  const testValues = tests
                    .map((key) => {
                      const value = grades.tests[key];
                      return value !== '' && typeof value === 'number'
                        ? Math.round(value * 100)
                        : null;
                    })
                    .filter((v): v is number => v !== null);

                  const homeworkValues = homework
                    .map((key) => {
                      const value = grades.homework[key];
                      return value !== '' && typeof value === 'number' ? Math.round(value) : null;
                    })
                    .filter((v): v is number => v !== null);

                  return {
                    lesson,
                    tests: testValues.length > 0 ? testValues : null,
                    homework: homeworkValues.length > 0 ? homeworkValues : null,
                  };
                });

                updateData('grades', { lessons });

                if (grades) {
                  const homeworkGrades = Object.entries(grades.homework)
                    .filter(([key, value]) => key.startsWith('hN') && typeof value === 'number')
                    .map(([, value]) => value as number);

                  const avgPoints =
                    homeworkGrades.length > 0
                      ? parseFloat(
                          (
                            homeworkGrades.reduce((a, b) => a + b, 0) / homeworkGrades.length
                          ).toFixed(1)
                        )
                      : null;
                  updateData('averageGradePoints', avgPoints);

                  const testGrades = Object.entries(grades.tests)
                    .filter(([key, value]) => key.startsWith('testN') && typeof value === 'number')
                    .map(([, value]) => value as number);

                  const avgPercentages =
                    testGrades.length > 0
                      ? Math.round(
                          (testGrades.reduce((a, b) => a + b, 0) / testGrades.length) * 100
                        )
                      : null;
                  updateData('averageGradePercentages', avgPercentages);
                }
                toast.success('Оцінки успішно отримано з Google!', { autoClose: 3000 });
              }}
              onReset={(resetFn) => (fetchGradesResetRef.current = resetFn)}
              initialTelegramId={data.telegramId}
            />
          </div>
          {data.grades && (
            <div style={styles.dataDisplay}>
              <strong>Оцінки:</strong>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginTop: '10px',
                }}
              >
                <div>
                  {data.grades.lessons.slice(0, 15).map(({ lesson, tests, homework }: Lesson) => {
                    const testDisplay = tests ? tests.map((v) => `${v}%`).join(', ') : '-';
                    const homeworkDisplay = homework ? homework.join(', ') : '-';
                    const content =
                      testDisplay === '-' && homeworkDisplay === '-'
                        ? '-'
                        : `${testDisplay === '-' ? '' : testDisplay}${
                            testDisplay !== '-' && homeworkDisplay !== '-' ? ' - ' : ''
                          }${homeworkDisplay === '-' ? '' : homeworkDisplay}`;

                    return (
                      <div key={lesson}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>Урок {lesson} - </span>
                        <span style={{ color: '#a1a1b3' }}>{content}</span>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {data.grades.lessons.slice(15).map(({ lesson, tests, homework }: Lesson) => {
                    const testDisplay = tests ? tests.map((v) => `${v}%`).join(', ') : '-';
                    const homeworkDisplay = homework ? homework.join(', ') : '-';
                    const content =
                      testDisplay === '-' && homeworkDisplay === '-'
                        ? '-'
                        : `${testDisplay === '-' ? '' : testDisplay}${
                            testDisplay !== '-' && homeworkDisplay !== '-' ? ' - ' : ''
                          }${homeworkDisplay === '-' ? '' : homeworkDisplay}`;

                    return (
                      <div key={lesson}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>Урок {lesson} - </span>
                        <span style={{ color: '#a1a1b3' }}>{content}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ gridColumn: 'span 3', ...styles.card }}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{data.averageGradePoints ?? '-'}</div>
            <div style={styles.label}>Середній бал:</div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 3', ...styles.card }}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {data.averageGradePoints ? `${data.averageGradePercentages}%` : '-'}
            </div>
            <div style={styles.label}>Середній бал в %:</div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <label htmlFor="recommendationsCurator" style={styles.label}>
            Рекомендації від куратора курсу:
          </label>
          <div style={styles.editor}>
            <QuillEditor
              value={data.recommendationsCurator}
              onChange={(content: string) => updateData('recommendationsCurator', content)}
              maxLength={430} // Обмеження символів
            />
          </div>
        </div>

        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <label htmlFor="recommendationsMentor" style={styles.label}>
            Рекомендації від наставника курсу:
          </label>
          <div style={styles.editor}>
            <QuillEditor
              value={data.recommendationsMentor}
              onChange={(content: string) => updateData('recommendationsMentor', content)}
              maxLength={1000}
            />
          </div>
        </div>

        <InputField
          id="videoReview"
          label="Youtube id на відео-відгук"
          value={data.videoReview}
          onChange={(value) => updateData('videoReview', value)}
          placeholder="Введіть id відео Youtube"
          style={{ gridColumn: 'span 6', ...styles.card }}
        />

        <InputField
          id="caseLink"
          label="Посилання на Кейс"
          value={data.caseLink}
          onChange={(value) => updateData('caseLink', value)}
          placeholder="Введіть посилання на Кейс"
          style={{ gridColumn: 'span 6', ...styles.card }}
        />

        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <div style={styles.buttonContainer}>
            <GeneratePdfButton
              certificateData={data}
              onPdfGenerated={(pdf: string) => {
                updateData('pdfUrl', pdf);
                toast.success(
                  data.certificateId ? 'PDF успішно оновлено!' : 'PDF успішно згенеровано!',
                  { autoClose: 3000 }
                );
              }}
              onReset={(resetFn) => (generatePdfResetRef.current = resetFn)}
              initialIsGenerated={!!data.certificateId}
              setNotification={(notification) =>
                notification
                  ? notification.variant === 'success'
                    ? toast.success(notification.message, { autoClose: 3000 })
                    : toast.error(notification.message, { autoClose: 3000 })
                  : null
              }
            />
            <Button variant="secondary" onClick={resetForm}>
              Очистити введені дані
            </Button>
          </div>
          {data.pdfUrl && (
            <div style={styles.dataDisplay}>
              <strong>Згенерований PDF: </strong>{' '}
              <Button variant="default" onClick={openPdfInNewTab}>
                Відкрити PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
