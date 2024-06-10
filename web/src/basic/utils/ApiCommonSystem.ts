import axios from 'axios';

export const ApiGetCommonSystemInfo = async () => (await axios.get<ApiCommonSystemInfoType>('/api/common/system/info')).data;
