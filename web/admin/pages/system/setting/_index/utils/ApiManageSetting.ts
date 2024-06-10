import axios from 'axios';

export const ApiUploadManageSettingUploadLogo = async (data: {
  file: File,
  old_logo: string
}) => (await axios.postForm<string>('/api/manage/setting/upload-logo', data)).data;
