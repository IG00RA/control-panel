import React from 'react';
import { DatePicker } from '@strapi/design-system';

interface DatePickerFieldProps {
  id: string;
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

export const normalizeDate = (date: Date | null): Date | null => {
  if (!date) return null;
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

const DatePickerField: React.FC<DatePickerFieldProps> = React.memo(
  ({ id, label, value, onChange, style, labelStyle }) => {
    const handleChange = (date: Date) => {
      // Нормалізуємо дату перед передачею в onChange
      const normalizedDate = normalizeDate(date);
      onChange(normalizedDate);
    };

    const handleClear = () => {
      onChange(null);
    };

    // Нормалізуємо значення для відображення
    const displayValue = value ? new Date(value) : null;

    return (
      <div style={style}>
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
        <DatePicker
          id={id}
          value={displayValue} // Використовуємо ненормалізовану дату для відображення
          onChange={handleChange}
          onClear={handleClear}
          locale="ru-RU"
          size="M"
        />
      </div>
    );
  }
);

export default DatePickerField;
