import axios from 'axios';
import log from 'loglevel';

import { Res } from '@common/basic/types/axios';

const handleServerError = (res: Res) => {
  log.debug('axios -> server error', res);
  return Promise.reject({
    ...res,
    msg: res.msg || '服务端错误, 并且服务端未返回错误信息',
  });
};

export const initAxios = () => {
  axios.interceptors.response.use(
    response => {
      const res = response.data;
      if (res?.code) {
        return handleServerError(res);
      }
      return res;
    },
    error => {
      if (error?.msg) {
        return Promise.reject(error);
      }
      if (error.response) {
        const res = error.response.data;
        if (res?.msg) {
          return handleServerError(res);
        }
        if (res?.code) {
          return handleServerError(res);
        }
      }
      return Promise.reject(
        {
          code: error.code,
          msg: error.message,
          data: error.response.data,
        },
      );
    },
  );
};
