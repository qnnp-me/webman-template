declare type AdminResponse<T = unknown> = {
  code: number;
  msg: string;
  data: T;
}
