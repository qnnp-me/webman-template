import axios, { AxiosError } from 'axios';
import log from 'loglevel';

import {Res} from '../../types/axios';

const handleServerError = (res: Res) => {
  log.debug('axios -> server error', res);
  const errMsg = res.msg || '服务端错误, 并且服务端未返回错误信息';
  return Promise.reject({
    ...res,
    name: 'server error',
    message: errMsg,
    msg: errMsg,
  } as Error);
};

export const initAxios = () => {
  axios.interceptors.response.use(
    response => {
      const res = response.data as unknown as Res | undefined;
      if (res?.code) {
        return handleServerError(res);
      }
      return res as never;
    },
    (error: Error | Res | undefined) => {
      if ((error as Res)?.msg) {
        return Promise.reject(error as Error);
      }
      if ((error as AxiosError | undefined)?.response) {
        const res = (error as AxiosError).response?.data as Res | undefined;
        if (res?.msg) {
          return handleServerError(res);
        }
        if (res?.code) {
          return handleServerError(res);
        }
      }
      return Promise.reject(
        {
          ...error,
          code: (error as AxiosError | undefined)?.code,
          msg: (error as AxiosError | undefined)?.message,
          data: (error as AxiosError | undefined)?.response?.data,
        } as unknown as Error,
      );
    },
  );
};
