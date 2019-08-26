const fs = require('fs')
const path = require('path')

const projectPath = process.cwd()

/**
 * 判断页面是否存在
 * @param  {string} pageName 页面名称
 */
const checkIsExist = pageName => {
    const appJSONObject = require('../src/app.json')

    // 检查是否存在于 app.json 文件
    if (!pageName) return true

    const isExist = appJSONObject.pages.find(path => path.endsWith('/' + pageName))
    return Boolean(isExist)
}

const getDirs = dirPath => fs.readdirSync(dirPath).filter((file) => fs.statSync(path.resolve(dirPath, file)).isDirectory())

const Commands = {
    /**
     * 添加页面路径到 app.json
     * @param  {string} pageName 页面名称
     */
    add(pageName) {
        // 若不存在，则写入
        if (!checkIsExist(pageName)) {
            const appJSONObject = require('../src/app.json')

            fs.writeFileSync(path.resolve(projectPath, 'src', 'app.json'), JSON.stringify({
                ...appJSONObject,
                pages: appJSONObject.pages.concat(`pages/${pageName}/${pageName}`)
            }, null, 2), 'utf8')
        }
    },

    /**
     * 从 app.json 文件中移除路径
     * @param  {string} pageName 页面名称
     */
    remove(pageName) {
        if (checkIsExist(pageName)) {
            const appJSONObject = require('../src/app.json')

            // 页面存在于 app.json 文件
            fs.writeFileSync(path.resolve(projectPath, 'src', 'app.json'), JSON.stringify({
                ...appJSONObject,
                pages: appJSONObject.pages.filter(path => !path.endsWith('/' + pageName))
            }, null, 2), 'utf8')
        }
    },
    /**
     * 遍历 pages 目录并更新 app.json 文件
     */
    loop() {
        const appJSONObject = require('../src/app.json')
        const pageFolderPath = path.resolve(projectPath, 'src', 'pages')
        const dirs = getDirs(pageFolderPath).map(dirName => `pages/${dirName}/${dirName}`)

        fs.writeFileSync(path.resolve(projectPath, 'src', 'app.json'), JSON.stringify({
            ...appJSONObject,
            pages: Array.from(appJSONObject.pages).filter(path => dirs.includes(path))
        }, null, 2), 'utf8')
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