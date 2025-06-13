import React, { useState } from 'react';
import { Button, TextInput, Box, Typography, Flex } from '@strapi/design-system';
import { Duplicate } from '@strapi/icons';

const ShortLinkCreator: React.FC = () => {
  const [parameters, setParameters] = useState<Array<string>>(Array(8).fill(''));
  const [fbp, setFbp] = useState<string>('');
  const [refId, setRefId] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleParameterChange = (index: number, value: string) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = value;
    setParameters(updatedParameters);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Ошибка при копировании ссылки');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const nonEmptyParams: Record<string, string> = parameters
      .map((value, index) => (value ? `sub${index + 1}: ${value}` : null))
      .filter(Boolean)
      .reduce((acc, curr, index) => ({ ...acc, [`sub${index + 1}`]: curr?.split(': ')[1] }), {});

    if (fbp) nonEmptyParams['fbp'] = fbp;
    if (refId) nonEmptyParams['ref_id'] = refId;

    const token = localStorage?.getItem('jwtToken')?.replace(/['"]+/g, '');

    try {
      const response = await fetch('/short-links/short', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          data: {
            parameters: nonEmptyParams,
            originalUrl: 'https://spreadsheets.mustage.team/ua',
            createdByUser: 'admin',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setShortUrl(responseData.shortUrl);
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
            <Flex alignItems="center" gap={2}>
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
              <button
                onClick={handleCopy}
                disabled={!shortUrl}
                type="button"
                title={copied ? 'Скопировано!' : 'Копировать ссылку'}
                style={{
                  cursor: 'pointer',
                  padding: '5px',
                  backgroundColor: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                }}
              >
                <Duplicate style={{ fill: 'blue' }} />
              </button>
            </Flex>
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
