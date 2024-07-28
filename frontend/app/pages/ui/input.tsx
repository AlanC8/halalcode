import React from 'react';

interface InputProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const Input: React.FC<InputProps> = ({ value, placeholder, onChange, onSubmit }) => {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSubmit(e);
        }
      }}
    />
  );
};

export default Input;
