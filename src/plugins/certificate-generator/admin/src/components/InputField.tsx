import React, { useState, useEffect } from 'react';
import { TextInput } from '@strapi/design-system';

interface InputFieldProps {
  id: string;
  label?: string;
  value: string | number | undefined | null;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  style?: React.CSSProperties;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({ id, label, value: initialValue, onChange, placeholder, type = 'text', style }) => {
    const [localValue, setLocalValue] = useState(initialValue?.toString() || '');

    // Синхронізація з початковим значенням, якщо воно зміниться ззовні
    useEffect(() => {
      setLocalValue(initialValue?.toString() || '');
    }, [initialValue]);

    const handleBlur = () => {
      onChange(localValue); // Передаємо значення батьківському компоненту лише при втраті фокусу
    };

    return (
      <div style={style}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#fff',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            {label}
          </label>
        )}
        <TextInput
          id={id}
          type={type}
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

export default InputField;
