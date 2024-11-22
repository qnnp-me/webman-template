import axios from 'axios';

declare type Res<T = unknown> = {
  code?: number;
  count?: number;
  msg?: string;
  data: T;
}

declare module 'axios' {
  export interface AxiosInstance {
    request<T = unknown> (config: AxiosRequestConfig): Promise<Res<T>>;
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<Res<T>>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<Res<T>>;
    head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<Res<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Res<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Res<T>>;
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Res<T>>;
  }
}
