import { CC_FTEMPLATE_GATEWAY, CC_NODE_ENV } from './constants';

import version from 'package.json';

export const environment = {
  production: true,
  CC_VERSION: version.version,
  CC_GATEWAY_URL: CC_FTEMPLATE_GATEWAY,
  CC_ENV_NAME: CC_NODE_ENV,
};
