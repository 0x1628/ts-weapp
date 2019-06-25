/**
 * 项目配置信息
 * 注意：需要修改 env 变量，可选值：env 或 prod
 */
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

// 移除不必要的属性
config = omit(config, 'dev', 'prod')

export default config
