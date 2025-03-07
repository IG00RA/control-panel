import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';

interface StatusSelectProps {
  value: 'valid' | 'discontinued' | 'cancelled' | null;
  onChange: (value: 'valid' | 'discontinued' | 'cancelled' | null) => void;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

const StatusSelect: React.FC<StatusSelectProps> = React.memo(
  ({ value: initialValue, onChange, style, labelStyle }) => {
    // Змінюємо початкове значення з undefined на 'valid'
    const [localValue, setLocalValue] = useState<
      'valid' | 'discontinued' | 'cancelled' | undefined
    >(initialValue || 'valid');

    useEffect(() => {
      setLocalValue(initialValue || 'valid');
    }, [initialValue]);

    const handleChange = (value: 'valid' | 'discontinued' | 'cancelled' | undefined) => {
      setLocalValue(value);
      onChange(value || null);
    };

    return (
      <div style={style}>
        <label htmlFor="certStatus" style={labelStyle}>
          Статус сертифікату
        </label>
        <SingleSelect
          id="certStatus"
          value={localValue}
          onChange={handleChange}
          placeholder="Select status"
        >
          <SingleSelectOption value="valid">Дійсний</SingleSelectOption>
          <SingleSelectOption value="discontinued">Припинено</SingleSelectOption>
          <SingleSelectOption value="cancelled">Анульовано</SingleSelectOption>
        </SingleSelect>
      </div>
    );
  }
);

export default StatusSelect;
