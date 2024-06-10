import { useEffect, useRef, useState } from 'react';

import { InputNumber } from 'antd';

export const TableEditableCellNumber = <T = unknown, V = unknown>(
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
  return <InputNumber
    type={'number'}
    ref={inputRef as never}
    value={editValue as string}
    onChange={e => setEditValue(e as V)}
    variant={editable ? 'outlined' : 'filled'}
    readOnly={!editable}
    onClick={e => {
      e.stopPropagation();
      setEditable(true);
    }}
    onFocus={() => {
      setEditable(true);
    }}
    onBlur={() => setEditable(false)}
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
