import React, { useCallback, useRef, useState } from 'react';
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
  });

  const fetchGradesResetRef = useRef<(() => void) | null>(null);
  const generateUuidResetRef = useRef<(() => void) | null>(null);

  const updateData = useCallback((key: keyof CertificateData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

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
      });
      if (fetchGradesResetRef.current) {
        fetchGradesResetRef.current();
      }
      if (generateUuidResetRef.current) {
        generateUuidResetRef.current();
      }
    }
  };

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
      // Стиль для контейнера кнопок
      display: 'flex',
      gap: '12px',
    },
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Certificate Generator</h1>
      <div style={styles.grid}>
        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <GenerateUuidButton
            onUuidGenerated={(uuid: string) => updateData('uuid', uuid)}
            onReset={(resetFn) => (generateUuidResetRef.current = resetFn)}
          />
          {data.uuid && (
            <div style={styles.dataDisplay}>
              <strong>Згенерований UUID:</strong> {data.uuid}
            </div>
          )}
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
              onGradesFetched={(grades: any) => {
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
              }}
              onReset={(resetFn) => (fetchGradesResetRef.current = resetFn)}
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
            />
          </div>
        </div>

        <InputField
          id="videoReview"
          label="Посилання на відео-відгук"
          value={data.videoReview}
          onChange={(value) => updateData('videoReview', value)}
          placeholder="Введіть посилання"
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
              onPdfGenerated={(pdf: string) => updateData('pdfUrl', pdf)}
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
