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

const DatePickerField: React.FC<DatePickerFieldProps> = React.memo(
  ({ id, label, value, onChange, style, labelStyle }) => {
    const handleChange = (date: Date) => {
      onChange(date);
    };

    const handleClear = () => {
      onChange(null);
    };

    return (
      <div style={style}>
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
        <DatePicker
          id={id}
          value={value}
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
