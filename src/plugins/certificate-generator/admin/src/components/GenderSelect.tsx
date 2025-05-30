import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';

interface GenderSelectProps {
  value: 'male' | 'female' | null;
  onChange: (value: 'male' | 'female' | null) => void;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

const GenderSelect: React.FC<GenderSelectProps> = React.memo(
  ({ value: initialValue, onChange, style, labelStyle }) => {
    const [localValue, setLocalValue] = useState<'male' | 'female' | undefined>(
      initialValue || 'male'
    );

    useEffect(() => {
      setLocalValue(initialValue || 'male');
    }, [initialValue]);

    const handleChange = (value: 'male' | 'female' | undefined) => {
      setLocalValue(value);
      onChange(value || null);
    };

    return (
      <div style={style}>
        <label htmlFor="gender" style={labelStyle}>
          Стать
        </label>
        <SingleSelect
          id="gender"
          value={localValue}
          onChange={handleChange}
          placeholder="Оберіть стать"
        >
          <SingleSelectOption value="male">Чоловік</SingleSelectOption>
          <SingleSelectOption value="female">Жінка</SingleSelectOption>
        </SingleSelect>
      </div>
    );
  }
);

export default GenderSelect;
