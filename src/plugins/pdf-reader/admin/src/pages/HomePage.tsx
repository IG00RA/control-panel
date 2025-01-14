import { Main, Box, Typography, Button, Flex } from '@strapi/design-system';
import { useEffect, useState } from 'react';

interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink: string;
}

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);

  useEffect(() => {
    fetch('/pdf-reader/files')
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch((err) => console.error('Error fetching files:', err));
  }, []);

  const handlePdfClick = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <Main>
      <Box padding={8} background="neutral100">
        <Typography variant="alpha" as="h2" textColor="primary600" style={{ marginBottom: '30px' }}>
          Resume Files on Drive
        </Typography>
        <Box padding={4} background="neutral0" shadow="tableShadow" hasRadius>
          {files.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {files.map((file) => (
                <li key={file.id} style={{ marginBottom: '16px' }}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Typography textColor="neutral800">{file.name}</Typography>
                    <Button
                      onClick={() => handlePdfClick(file.webViewLink)}
                      size="S"
                      variant="secondary"
                    >
                      View PDF
                    </Button>
                  </Flex>
                </li>
              ))}
            </ul>
          ) : (
            <Typography textColor="neutral500">No PDF files available.</Typography>
          )}
        </Box>
      </Box>
    </Main>
  );
};

export { HomePage };
