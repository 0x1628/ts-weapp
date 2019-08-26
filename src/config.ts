import { omit } from './utils/util'

const env = 'dev'

let config: any = {
  dev: {
    api: 'https://dev',
    ekey: 'REPLACE_YOUR_SECRET_KEY',
  },
  prod: {
    api: 'https://prod',
    ekey: 'REPLACE_YOUR_SECRET_KEY',
  },
}

config = {
  ...config[env],
  ...config,
}

config = omit(config, 'dev', 'prod')

export default config
