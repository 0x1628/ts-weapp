const fs = require('fs')
const path = require('path')

const appJSON = require('../src/app.json')

const pages = appJSON.pages
const projectPath = process.cwd()

/**
 * 判断页面是否存在
 * @param  {string} pageName 页面名称
 */
const checkIsExist = pageName => {
    // 检查是否存在于 app.json 文件
    if (!pageName) return true

    const isExist = pages.find(path => path.endsWith('/' + pageName))
    return Boolean(isExist)
}

const getDirs = _path => fs.readdirSync(_path).filter((file) => fs.statSync(path.resolve(_path, file)).isDirectory())

const Commands = {
    /**
     * 添加页面路径到 app.json
     * @param  {string} pageName 页面名称
     */
    add(pageName) {
        // 若不存在，则写入
        if (!checkIsExist(pageName)) {
            pages.push(`pages/${pageName}/${pageName}`)
            fs.writeFileSync(path.resolve(projectPath, 'src', 'app.json'), JSON.stringify(appJSON), 'utf8')
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
            fs.writeFileSync(path.resolve(projectPath, 'src', 'app.json'), JSON.stringify(appJSON), 'utf8')
        }
    },
    /**
     * 遍历 pages 目录并更新 app.json 文件
     */
    loop() {
        const pageFolderPath = path.resolve(projectPath, 'src', 'pages')
        let dirs = getDirs(pageFolderPath)
        dirs = Array.from(dirs, dirName => `pages/${dirName}/${dirName}`)

        let _pages = JSON.parse(JSON.stringify(pages))

        appJSON.pages = _pages.filter(path => dirs.includes(path))

        fs.writeFileSync(path.resolve(projectPath, 'src', 'app.json'), JSON.stringify(appJSON), 'utf8')
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