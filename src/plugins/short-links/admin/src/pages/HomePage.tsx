import React, { useState } from 'react';
import { Button, TextInput, Box, Typography, Flex } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';

const ShortLinkCreator: React.FC = () => {
  const [parameters, setParameters] = useState<Array<string>>(Array(8).fill(''));
  const [fbp, setFbp] = useState<string>('');
  const [refId, setRefId] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useFetchClient();

  const handleParameterChange = (index: number, value: string) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = value;
    setParameters(updatedParameters);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Filter out empty parameters and create an object
    const nonEmptyParams = parameters
      .map((value, index) => (value ? `sub${index + 1}: ${value}` : null))
      .filter(Boolean)
      .reduce((acc, curr, index) => ({ ...acc, [`sub${index + 1}`]: curr?.split(': ')[1] }), {});

    // Add fbp and refId if they exist
    if (fbp) nonEmptyParams['fbp'] = fbp;
    if (refId) nonEmptyParams['ref_id'] = refId;

    try {
      const response = await post('/short-links/short', {
        data: {
          parameters: nonEmptyParams,
          originalUrl: 'https://spreadsheets.mustage.team/ua',
          createdByUser: 'admin', // Replace with actual user ID or logic to get authenticated user
        },
      });

      setShortUrl(response.data.shortUrl);
      // Clear input fields on successful generation
      setParameters(Array(8).fill(''));
      setFbp('');
      setRefId('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании короткой ссылки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={4} background="neutral0" shadow="filterShadow">
      <Typography variant="alpha">Создать короткую ссылку</Typography>
      <Box paddingTop={4}>
        <Flex direction="column" gap={4}>
          {/* FBP and RefId inputs */}
          <Flex gap={4} wrap="wrap">
            <Box flex="1" minWidth="200px">
              <TextInput
                label="FBP"
                name="fbp"
                value={fbp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFbp(e.target.value)}
                placeholder="Введите FBP (опционально)"
              />
            </Box>
            <Box flex="1" minWidth="200px">
              <TextInput
                label="Ref ID"
                name="refId"
                value={refId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefId(e.target.value)}
                placeholder="Введите Ref ID (опционально)"
              />
            </Box>
          </Flex>

          {/* Existing sub parameters */}
          {[...Array(4)].map((_, rowIndex) => (
            <Flex key={`row-${rowIndex}`} gap={4} wrap="wrap">
              <Box flex="1" minWidth="200px">
                <TextInput
                  label={`Параметр Sub${rowIndex * 2 + 1}`}
                  name={`sub${rowIndex * 2 + 1}`}
                  value={parameters[rowIndex * 2]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleParameterChange(rowIndex * 2, e.target.value)
                  }
                  placeholder={`Введите sub${rowIndex * 2 + 1} (опционально)`}
                />
              </Box>
              <Box flex="1" minWidth="200px">
                <TextInput
                  label={`Параметр Sub${rowIndex * 2 + 2}`}
                  name={`sub${rowIndex * 2 + 2}`}
                  value={parameters[rowIndex * 2 + 1]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleParameterChange(rowIndex * 2 + 1, e.target.value)
                  }
                  placeholder={`Введите sub${rowIndex * 2 + 2} (опционально)`}
                />
              </Box>
            </Flex>
          ))}
        </Flex>
        <Button onClick={handleSubmit} disabled={loading} marginTop={4}>
          {loading ? 'Создание...' : 'Создать короткую ссылку'}
        </Button>
        {shortUrl && (
          <Box paddingTop={2}>
            <Typography>
              Короткая ссылка:{' '}
              <Typography
                as="a"
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                textColor="primary600"
                style={{
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none',
                    color: '#b9b9b9',
                  },
                }}
              >
                {shortUrl}
              </Typography>
            </Typography>
          </Box>
        )}
        {error && (
          <Box paddingTop={2}>
            <Typography color="danger">{error}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShortLinkCreator;
