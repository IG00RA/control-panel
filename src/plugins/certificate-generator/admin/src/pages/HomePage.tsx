import React, { useState } from 'react';
import GenerateUuidButton from '../components/GenerateUuidButton';
import FetchGrades from '../components/FetchGrades';
import GeneratePdfButton from '../components/GeneratePdfButton';

// Інтерфейс для пропсів
interface HomePageProps {}

// Інтерфейс для стану
interface CertificateData {
  uuid: string | null;
  fullName: string;
  streamNumber: number | null;
  startDate: Date | null;
  endDate: Date | null;
  tariff: string | null;
  telegramId: string;
  grades: any;
  qrCode: string | null;
  averageGradePoints: number | null;
  averageGradePercentages: number | null;
  recommendationsMentor: string;
  recommendationsCurator: string;
  videoReview: string;
  caseLink: string;
  pdfUrl: string | null;
}

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
  });

  // Функція для оновлення стану
  const updateData = (key: keyof CertificateData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Стилі
  const styles = {
    main: {
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
    label: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#fff',
      marginBottom: '8px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      marginTop: '4px',
      color: '#f8f8f9',
      backgroundColor: 'rgb(24, 24, 38)',
      border: '1px solid #383856',
      borderRadius: '6px',
      fontSize: '0.95rem',
      transition: 'border-color 0.3s ease',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      marginTop: '4px',
      color: '#f8f8f9',
      backgroundColor: 'rgb(24, 24, 38)',
      border: '1px solid #383856',
      borderRadius: '6px',
      fontSize: '0.95rem',
      minHeight: '120px',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      resize: 'vertical',
    },
    infoText: {
      fontSize: '1.5rem',
      color: '#a1a1b3',
      margin: '10px 0',
    },
    dataDisplay: {
      backgroundColor: 'rgb(24, 24, 38)',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '0.9rem',
      overflowX: 'auto',
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
    statLabel: {
      fontSize: '0.9rem',
      color: '#a1a1b3',
      textAlign: 'center' as const,
    },
  };

  // Стилі з фокусом для інпутів
  const focusableInputStyle = {
    ...styles.input,
    ':focus': {
      borderColor: '#6b6bef',
      boxShadow: '0 0 0 2px rgba(107, 107, 239, 0.2)',
    },
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Certificate Generator</h1>
      <div style={styles.grid}>
        {/* UUID */}
        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <GenerateUuidButton onUuidGenerated={(uuid: string) => updateData('uuid', uuid)} />
          {data.uuid && (
            <div style={styles.dataDisplay}>
              <strong>Generated UUID:</strong> {data.uuid}
            </div>
          )}
        </div>

        {/* Full Name */}
        <div style={{ gridColumn: 'span 4', ...styles.card }}>
          <label htmlFor="fullName" style={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData('fullName', e.target.value)
            }
            placeholder="Enter full name"
            style={focusableInputStyle}
          />
        </div>

        {/* Tariff */}
        <div style={{ gridColumn: 'span 4', ...styles.card }}>
          <label htmlFor="tariff" style={styles.label}>
            Tariff
          </label>
          <select
            id="tariff"
            value={data.tariff || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateData('tariff', e.target.value || null)
            }
            style={focusableInputStyle}
          >
            <option value="">Select tariff</option>
            <option value="free">Free</option>
            <option value="start">Start</option>
            <option value="base">Base</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        {/* Stream Number */}
        <div style={{ gridColumn: 'span 4', ...styles.card }}>
          <label htmlFor="streamNumber" style={styles.label}>
            Stream Number
          </label>
          <input
            id="streamNumber"
            type="number"
            value={data.streamNumber || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData('streamNumber', e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="Enter stream number"
            style={focusableInputStyle}
          />
        </div>

        {/* Start Date */}
        <div style={{ gridColumn: 'span 3', ...styles.card }}>
          <label htmlFor="startDate" style={styles.label}>
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={data.startDate ? data.startDate.toISOString().split('T')[0] : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData('startDate', e.target.value ? new Date(e.target.value) : null)
            }
            style={focusableInputStyle}
          />
        </div>

        {/* End Date */}
        <div style={{ gridColumn: 'span 3', ...styles.card }}>
          <label htmlFor="endDate" style={styles.label}>
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={data.endDate ? data.endDate.toISOString().split('T')[0] : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData('endDate', e.target.value ? new Date(e.target.value) : null)
            }
            style={focusableInputStyle}
          />
        </div>

        {/* Grades */}
        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <label htmlFor="telegramId" style={styles.label}>
            Telegram ID
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <FetchGrades
              telegramId={data.telegramId}
              onGradesFetched={(grades: any) => {
                updateData('grades', grades);
                if (grades) {
                  // Обчислення середнього для homework (12-бальна система)
                  const homeworkGrades = Object.values(grades.homework).filter(
                    (grade): grade is number => typeof grade === 'number'
                  );
                  const avgPoints =
                    homeworkGrades.length > 0
                      ? Math.round(
                          homeworkGrades.reduce((a, b) => a + b, 0) / homeworkGrades.length
                        )
                      : null;
                  updateData('averageGradePoints', avgPoints);

                  // Обчислення середнього для tests (відсотки)
                  const testGrades = Object.values(grades.tests).filter(
                    (grade): grade is number => typeof grade === 'number'
                  );
                  const avgPercentages =
                    testGrades.length > 0
                      ? Math.round(
                          (testGrades.reduce((a, b) => a + b, 0) / testGrades.length) * 100
                        )
                      : null;
                  updateData('averageGradePercentages', avgPercentages);
                }
              }}
            />
          </div>

          {data.grades && (
            <div style={styles.dataDisplay}>
              <strong>Grades:</strong> <pre>{JSON.stringify(data.grades, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Average Grade Points */}
        <div style={{ gridColumn: 'span 6', ...styles.card }}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{data.averageGradePoints ?? '-'}</div>
            <div style={styles.statLabel}>Average Grade Points</div>
          </div>
        </div>

        {/* Average Grade Percentages */}
        <div style={{ gridColumn: 'span 6', ...styles.card }}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {data.averageGradePercentages ? `${data.averageGradePercentages}%` : '-'}
            </div>
            <div style={styles.statLabel}>Average Grade Percentages</div>
          </div>
        </div>

        {/* Recommendations Mentor */}
        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <label htmlFor="recommendationsMentor" style={styles.label}>
            Recommendations from Mentor
          </label>
          <textarea
            id="recommendationsMentor"
            value={data.recommendationsMentor}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateData('recommendationsMentor', e.target.value)
            }
            placeholder="Enter mentor recommendations"
            style={styles.textarea}
          />
        </div>

        {/* Recommendations Curator */}
        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <label htmlFor="recommendationsCurator" style={styles.label}>
            Recommendations from Curator
          </label>
          <textarea
            id="recommendationsCurator"
            value={data.recommendationsCurator}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateData('recommendationsCurator', e.target.value)
            }
            placeholder="Enter curator recommendations"
            style={styles.textarea}
          />
        </div>

        {/* Video Review */}
        <div style={{ gridColumn: 'span 6', ...styles.card }}>
          <label htmlFor="videoReview" style={styles.label}>
            Video Review Link
          </label>
          <input
            id="videoReview"
            type="text"
            value={data.videoReview}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData('videoReview', e.target.value)
            }
            placeholder="Enter video review link"
            style={focusableInputStyle}
          />
        </div>

        {/* Case Link */}
        <div style={{ gridColumn: 'span 6', ...styles.card }}>
          <label htmlFor="caseLink" style={styles.label}>
            Case Link
          </label>
          <input
            id="caseLink"
            type="text"
            value={data.caseLink}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData('caseLink', e.target.value)
            }
            placeholder="Enter case link"
            style={focusableInputStyle}
          />
        </div>

        {/* PDF Generation */}
        <div style={{ gridColumn: 'span 12', ...styles.card }}>
          <GeneratePdfButton id="1" onPdfGenerated={(pdf: string) => updateData('pdfUrl', pdf)} />
          {data.pdfUrl && (
            <div style={styles.dataDisplay}>
              <strong>Generated PDF:</strong> {data.pdfUrl}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
