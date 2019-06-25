const fs = require('fs')
const {
    readdir,
    stat
} = require('fs')
const {
    join
} = require('path')

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

const getDirs = path => {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory()
    })
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
    },
    /**
     * 遍历 pages 目录并更新 app.json 文件
     */
    loop() {
        const pageFolderPath = __dirname + '/../src/pages'
        let dirs = getDirs(pageFolderPath)
        dirs = dirs.map(dirName => `pages/${dirName}/${dirName}`)

        let _pages = JSON.parse(JSON.stringify(pages))

        _pages.forEach(pagePath => {
            const isExist = dirs.includes(pagePath)
            if (!isExist) {
                _pages = _pages.filter(path => path !== pagePath)
            }
        })

        appJSON.pages = _pages

        fs.writeFileSync(__dirname + '/../src/app.json', JSON.stringify(appJSON), 'utf8')
    }
}

const commands = new Set([
    'add',
    'remove',
    'loop'
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