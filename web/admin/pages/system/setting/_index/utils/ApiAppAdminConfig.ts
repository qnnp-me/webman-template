import axios from 'axios';

export const ApiGetAppAdminConfig = async () => (await axios.get<SysConfigType>('/app/admin/config/get')).data;
export const ApiUpdateAppAdminConfig = async (data: Partial<SysConfigType>) => (await axios.post('/app/admin/config/update', data)).data;
