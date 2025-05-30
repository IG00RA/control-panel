import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';

interface TariffSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

const TariffSelect: React.FC<TariffSelectProps> = React.memo(
  ({ value: initialValue, onChange, style, labelStyle }) => {
    const [localValue, setLocalValue] = useState<string | undefined>(initialValue || undefined);

    useEffect(() => {
      setLocalValue(initialValue || undefined);
    }, [initialValue]);

    const handleChange = (value: string | undefined) => {
      setLocalValue(value);
      onChange(value || null);
    };

    return (
      <div style={style}>
        <label htmlFor="tariff" style={labelStyle}>
          Тариф
        </label>
        <SingleSelect
          id="tariff"
          value={localValue}
          onChange={handleChange}
          placeholder="Оберіть тариф"
        >
          <SingleSelectOption value="free">Free</SingleSelectOption>
          <SingleSelectOption value="start">Start</SingleSelectOption>
          <SingleSelectOption value="base">Base</SingleSelectOption>
          <SingleSelectOption value="pro">Pro</SingleSelectOption>
        </SingleSelect>
      </div>
    );
  }
);

export default TariffSelect;
