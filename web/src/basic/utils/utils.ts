const setPageLoading = window.setPageLoading;
const utils = {
  setPageLoading,
  // 获取验证码 URL, PHP 端使用 session()->get("captcha-$type") 读取验证码, 不区分大小写
  getCaptchaUrl: (type = 'login', withFresh = false) => `/app/admin/account/captcha/${type}${withFresh ? `?fresh=${Date.now()}` : ''}`,
};
export default utils;
