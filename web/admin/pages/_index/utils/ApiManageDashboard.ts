import axios from 'axios';

export const ApiGetManageDashboardStatus = async () => (await axios.get<string>('/api/manage/dashboard/status')).data;
