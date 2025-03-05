import React, { useState, useEffect } from 'react';
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
  ({ id, label, value: initialValue, onChange, style, labelStyle }) => {
    const [localValue, setLocalValue] = useState<Date | undefined>(initialValue || undefined);

    useEffect(() => {
      setLocalValue(initialValue || undefined);
    }, [initialValue]);

    const handleChange = (date: Date) => {
      setLocalValue(date);
      onChange(date); // Передаємо значення одразу
    };

    const handleClear = () => {
      setLocalValue(undefined);
      onChange(null);
    };

    return (
      <div style={style}>
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
        <DatePicker
          id={id}
          selectedDate={localValue}
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
