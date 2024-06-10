import { useEffect } from 'react';

import PageAdminHome from '@admin/pages';
import LayoutAdminMain from '@admin/pages/[layout].tsx';
import PageAdminIframe from '@admin/pages/iframe/[...].tsx';
import PageAdminLogin from '@admin/pages/login';
import PageAdminMySetting from '@admin/pages/my/setting';
import PageAdminSystemSetting from '@admin/pages/system/setting';
import { AdminSystemSettingTabBasic } from '@admin/pages/system/setting/_index/components/AdminSystemSettingTabBasic.tsx';
import { Captcha } from '@common/basic/components/Captcha.tsx';
import { IconSelector } from '@common/basic/components/Icon/IconSelector';
import { Page404 } from '@common/basic/components/Page404.tsx';
import { PageLoading } from '@common/basic/components/PageLoading.tsx';
import * as utils from '@common/basic/utils/utils.ts';
import { PaletteTree } from '@common/dev/palette.tsx';
import PageHome from '@home/pages/index.tsx';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';
import { AdminMySettingTabBasic } from "@admin/pages/my/setting/_index/components/AdminMySettingTabBasic.tsx";

const ComponentPreviews = () => {
  useEffect(() => {
    utils.setPageLoading(false);
  }, []);
  return (
    <Previews palette={<PaletteTree/>}>
      <ComponentPreview path="/PageAdminHome">
        <PageAdminHome/>
      </ComponentPreview>
      <ComponentPreview path="/PageHome">
        <PageHome/>
      </ComponentPreview>
      <ComponentPreview path="/ComponentPreviews">
        <ComponentPreviews/>
      </ComponentPreview>
      <ComponentPreview path="/PageLoading">
        <PageLoading loading={true}/>
      </ComponentPreview>
      <ComponentPreview path="/LayoutAdminMain">
        <LayoutAdminMain/>
      </ComponentPreview>
      <ComponentPreview path="/PageAdminIframe">
        <PageAdminIframe/>
      </ComponentPreview>
      <ComponentPreview path="/PageAdminLogin">
        <PageAdminLogin/>
      </ComponentPreview>
      <ComponentPreview path="/Captcha">
        <Captcha captchaType={'login'}/>
      </ComponentPreview>
      <ComponentPreview path="/Page404">
        <Page404/>
      </ComponentPreview>
      <ComponentPreview path="/IconSelector">
        <IconSelector value={'SmileTwoTone'} onChange={()=>{}} />
      </ComponentPreview>
      <ComponentPreview path="/PageAdminSystemSetting">
        <PageAdminSystemSetting/>
      </ComponentPreview>
      <ComponentPreview path="/SystemSettingTabBasic">
        <AdminSystemSettingTabBasic/>
      </ComponentPreview>
      <ComponentPreview path="/PageAdminMySetting">
        <PageAdminMySetting/>
      </ComponentPreview>
      <ComponentPreview path="/AdminMySettingTabBasic">
        <AdminMySettingTabBasic/>
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
