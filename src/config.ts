// 需要修改 env 变量
const env = 'dev'

const config = {
    dev: {
        api: 'https://dev',
    },
    prod: {
        api: 'https://prod',
    },
}

export default {
    ...config[env],
    ...config,
}
