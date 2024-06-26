import { useEffect } from 'react';

import PageAdminHome from '@admin/pages';
import LayoutAdminMain from '@admin/pages/[layout].tsx';
import PageAdminIframe from '@admin/pages/iframe/[...].tsx';
import PageAdminLogin from '@admin/pages/login';
import { Captcha } from '@common/basic/components/Captcha.tsx';
import Page404 from '@common/basic/components/Page404.tsx';
import PageLoading from '@common/basic/components/PageLoading.tsx';
import * as utils from '@common/basic/utils/utils.ts';
import { PaletteTree } from '@common/dev/palette.tsx';
import PageHome from '@home/pages/index.tsx';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';

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
    </Previews>
  );
};

export default ComponentPreviews;
