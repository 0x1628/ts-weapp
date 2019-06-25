const fs = require('fs')
const appJSON = require('../src/app.json')

const pages = appJSON.pages

/**
 * 判断页面是否存在
 * @param  {string} pageName 页面名称
 */
const checkIsExist = pageName => {
    // 检查是否存在于 app.json 文件
    if (!pageName) return true

    let isExist = pages.filter(path => path.endsWith('/' + pageName))
    return Boolean(isExist.length)
}

const Commands = {
    /**
     * 添加页面路径到 app.json
     * @param  {string} pageName 页面名称
     */
    add(pageName) {
        // 若不存在，则写入
        if (!checkIsExist(pageName)) {
            const path = `pages/${pageName}/${pageName}`
            pages.push(path)
            fs.writeFileSync(__dirname + '/../src/app.json', JSON.stringify(appJSON), 'utf8')
        }
    },

    /**
     * 从 app.json 文件中移除路径
     * @param  {string} pageName 页面名称
     */
    remove(pageName) {
        if (checkIsExist(pageName)) {
            // 页面存在于 app.json 文件
            appJSON.pages = pages.filter(path => !path.endsWith('/' + pageName))
            fs.writeFileSync(__dirname + '/../src/app.json', JSON.stringify(appJSON), 'utf8')
        }
    }
}

const commands = new Set([
    'add',
    'remove',
])

let cmd = process.argv[2]
let args = []

if (commands.has(cmd)) {
    args = process.argv.slice(3)
} else {
    cmd = '--help'
}

if (new Set(['--help', '-h']).has(cmd)) {
    console.log(`
      Usage
        $ page <command>
  
      Available commands
        ${Array.from(commands).join(', ')}
    `)
    process.exit(0)
}

if (!Commands[cmd]) {
    console.error('Wrong command')
    process.exit(1)
}

Commands[cmd](...args)