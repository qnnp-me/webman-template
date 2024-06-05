import { isEqual, omit } from 'lodash';
import { useEffect, useState } from 'react';

import { App, FormInstance } from 'antd';

import { ModalForm, ModalFormProps } from '@ant-design/pro-components';

export const ModalEditForm = <T = unknown>(props: {
  // 初始或者编辑的数据
  editData: T
  onFinish: (values: T) => unknown
  onCancel: () => void
  form?: FormInstance<T>
  // 是否需要二次确认取消, 前提是有 form 的
  cancelConfirm?: boolean
  children: React.ReactNode
} & Omit<ModalFormProps, 'onFinish'>) => {
  const {
    editData,
    form,
    onFinish,
    onCancel,
    modalProps,
    cancelConfirm = false,
    children,
  } = props;
  const { modal } = App.useApp();
  const [open, setOpen] = useState(!!editData);
  const [initialValues, setInitialValues] = useState<T>(editData);
  useEffect(() => {
    setOpen(!!editData);
    if (editData) {
      setInitialValues(editData);
      form && requestAnimationFrame(() => {
        form.resetFields();
        if (cancelConfirm) {
          requestAnimationFrame(() => {
            setInitialValues(form.getFieldsValue());
          });
        }
      });
    }
  }, [editData]);
  const handleCancel = () => {
    if (form && cancelConfirm) {
      const changed = !isEqual(form.getFieldsValue(), initialValues);
      if (changed) {
        modal.confirm({
          title: '确认取消?',
          content: '表单数据尚未保存, 是否确认取消?',
          centered: true,
          onOk: onCancel,
        });
        return;
      }
    }
    onCancel();
  };
  return <ModalForm<T>
    isKeyPressSubmit
    open={open}
    onFinish={onFinish as never}
    request={(() => Promise.resolve(initialValues)) as never}
    {...omit(props, ['editData', 'cancelConfirm'] as (keyof typeof props)[]) as object}
    modalProps={{
      closable: false,
      maskClosable: false,
      keyboard: false,
      destroyOnClose: true,
      onCancel: handleCancel,
      ...modalProps,
    }}
    children={children}
  />;
};
