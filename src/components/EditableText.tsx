import React from 'react';
import { Input } from 'antd';

interface DoInputProps {
  defaultValue?: string;
  updateValue: (value: string) => void;
}

const EditableText: React.FC<DoInputProps> = ({ updateValue, defaultValue }) => {
  const [isModify, setIsModify] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>(
    defaultValue ?? '',
  );

  const inputRef = React.useRef(null);

  const toggleModify = React.useCallback(() => {
    setIsModify((curr) => !curr);
  }, []);
  const onSubmit = () => {
    toggleModify();
    updateValue(inputValue);
  };
  const onChangeInput = React.useCallback(({ target: { value } }) => {
    setInputValue(value);
  }, []);
  const onBlurInput = React.useCallback(() => {
    if (inputValue) {
      onSubmit();
      return null;
    }

    setInputValue(defaultValue ?? '');
  }, [inputValue, defaultValue, onSubmit]);
  const onKeyUpInput = React.useCallback(
    ({ keyCode, which }) => {
      const keycode = keyCode || which;
      if (keycode === 13) {
        if (inputValue) {
          onSubmit();
          return null;
        }
      }
    },
    [inputValue],
  );

  React.useEffect(() => {
    if (isModify) {
      inputRef.current?.focus?.();
    }
  }, [isModify]);

  return isModify ? (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={onChangeInput}
      onBlur={onBlurInput}
      onKeyUp={onKeyUpInput}
      required={true}
    />
  ) : (
    <p onDoubleClick={toggleModify}>{defaultValue}</p>
  );
};

EditableText.displayName = 'EditableText';
export default React.memo(EditableText);
