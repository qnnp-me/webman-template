import axios from 'axios';

axios.interceptors.response.use(response => {
  if (response.status !== 200 || (response.data?.code && response.data?.msg)) {
    return Promise.reject(response.data?.msg ? response.data : response);
  }
  return response.data;
});
const useAppInit = () => {
};
export default useAppInit;
