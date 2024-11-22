import {ModalForm, ModalFormProps, ProForm} from '@ant-design/pro-components';
import {App} from 'antd';
import {isEqual, omit} from 'lodash';
import {useEffect, useState} from 'react';

export const ModalEditForm = <T = unknown>(props: {
  // 初始或者编辑的数据
  editData?: T
  onFinish: (values: T) => unknown
  onCancel: () => void
  // 是否需要二次确认取消, 前提是有 form 的
  cancelConfirm?: boolean
  children: React.ReactNode
} & Omit<ModalFormProps<T>, 'onFinish'>) => {
  const {
    open,
    editData,
    onFinish,
    onCancel,
    modalProps,
    cancelConfirm = false,
    children,
  } = props;
  const [local_form] = ProForm.useForm<T>();
  const form = props.form || local_form;
  const {modal} = App.useApp();
  const [openModal, setOpen] = useState(!!editData);
  const [initialValues, setInitialValues] = useState<T | undefined>(editData);
  useEffect(() => {
    open == undefined && setOpen(!!editData);
    if (editData) {
      setInitialValues(editData);
      form && requestAnimationFrame(() => {
        if (cancelConfirm) {
          requestAnimationFrame(() => {
            setInitialValues(form.getFieldsValue());
          });
        }
      });
    }
  }, [editData]);
  useEffect(() => {
    open != undefined && setOpen(open);
    open && form.resetFields();
  }, [open]);
  const handleCancel = () => {
    if (form && cancelConfirm) {
      const changed = !isEqual(
        JSON.parse(JSON.stringify(form.getFieldsValue())),
        initialValues,
      );
      if (changed) {
        console.log(
          JSON.parse(JSON.stringify(form.getFieldsValue())),
          initialValues,
        );
        void modal.confirm({
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
    form={form}
    isKeyPressSubmit
    open={openModal}
    onFinish={onFinish as never}
    {...omit(props, ['editData', 'cancelConfirm'] as (keyof typeof props)[]) as object}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    request={props.request
      ? (...args) =>
        props.request!(...args)
          .then(data => {
            setInitialValues(data);
            return data;
          })
      : (() => Promise.resolve(initialValues))
    }
    modalProps={{
      closable: false,
      maskClosable: false,
      keyboard: false,
      destroyOnClose: true,
      onCancel: handleCancel,
      ...modalProps,
    }}
  >{children}</ModalForm>;
};
