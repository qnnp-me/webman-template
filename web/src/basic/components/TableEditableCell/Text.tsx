import { useEffect, useRef, useState } from 'react';

import Input from 'antd/es/input/Input';

export const TableEditableCellText = <T = unknown, V = unknown>(
  { value, onSave }:
    {
      value: V
      onSave: (value: V) => T
    }) => {
  const [editValue, setEditValue] = useState(value);
  const [editable, setEditable] = useState(false);
  const handleSubmit = () => {
    onSave(editValue);
    inputRef.current?.blur();
  };
  useEffect(() => {
    setEditValue(value);
  }, [value]);
  useEffect(() => {
    if (!editable) {
      setEditValue(value);
    }
  }, [editable]);
  const inputRef = useRef<HTMLInputElement>();
  return <Input
    type={'number'}
    ref={inputRef as never}
    value={editValue as string}
    onInput={e => { setEditValue((e.target as HTMLInputElement).value as V); }}
    variant={editable ? 'outlined' : 'filled'}
    readOnly={!editable}
    onClick={e => {
      e.stopPropagation();
      setEditable(true);
    }}
    onFocus={() => {
      setEditable(true);
    }}
    onBlur={() => { setEditable(false); }}
    onKeyDown={e => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
    }}
    size={'small'}
  />;
};
