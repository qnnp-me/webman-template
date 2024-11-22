import { SystemStatus } from '#admin/pages/_index/components/SystemStatus.tsx';

import {BasicConfig} from '../../src/basic.config.ts';

export default function PageAdminHome() {
  return (
    <div>
      {BasicConfig.adminFolder}
      <SystemStatus/>
    </div>
  );
}
