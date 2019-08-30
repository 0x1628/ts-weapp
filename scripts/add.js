const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const base = process.cwd()

function ensureFolder(target) {
  return new Promise((resolve, reject) => {
    fs.stat(target, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.mkdir(target, resolve)
        } else {
          reject(err)
        }
        return
      }

      if (stats.isDirectory()) {
        if (fs.readdirSync(target).length) {
          reject(new Error(`${target} exists and is not empty`))
        } else {
          resolve()
        }
      } else {
        reject(new Error(`${target} exists and is not a directory`))
      }
    })
  })
}

// xxx-yyy-zzz => XxxYyyZzz
const classNameConverter = str => str.split('-').map(item => item.toLowerCase().replace(/( |^)[a-z]/g, firstLetter => firstLetter.toUpperCase())).join('')

const Commands = {
  page(pageName) {
    if (!pageName) {
      throw new Error('Must given a page name')
    }
    const pageFolder = path.resolve(base, 'src', 'pages', pageName)
    ensureFolder(pageFolder).then(() => {
      const sourceFolder = path.resolve(base, 'lib', 'templates', 'page')
      const sourceFiles = fs.readdirSync(sourceFolder)
      sourceFiles.forEach((source) => {
        const ext = source.split('.').pop()
        if (ext === 'page') {
          const templateData = fs.readFileSync(path.resolve(base, 'lib', 'templates', 'page', 'page'), {
            encoding: 'utf-8'
          }).replace(/#{name}/g, classNameConverter(pageName))
          fs.writeFileSync(path.resolve(pageFolder, `${pageName}.ts`), templateData, 'utf-8')
        } else {
          fs.copyFileSync(path.resolve(sourceFolder, source), path.resolve(pageFolder, `${pageName}.${ext}`))
        }

        // 追加 pageName 到 app.json
        child_process.execFile('node', [__dirname + '/page.js', 'add', pageName], (error, stdout, stderr) => {
          if (error) {
            console.log('页面路径追加到 app.json 文件失败：', {
              error, stdout, stderr
            })   
          }
        })
      })
      console.log(`Add page ${pageName} success`)
    }).catch(e => console.error(e))
  },
  component(componentName) {
    if (!componentName) {
      throw new Error('Must given a component name')
    }
    const componentFolder = path.resolve(base, 'src', 'components', componentName)
    ensureFolder(componentFolder).then(() => {
      const sourceFolder = path.resolve(base, 'lib', 'templates', 'component')
      const sourceFiles = fs.readdirSync(sourceFolder)
      sourceFiles.forEach((source) => {
        const ext = source.split('.').pop()
        if (ext === 'component') {
          const templateData = fs.readFileSync(path.resolve(base, 'lib', 'templates', 'component', 'component'), {
            encoding: 'utf-8'
          }).replace(/#{name}/g, classNameConverter(componentName))
          fs.writeFileSync(path.resolve(componentFolder, `${componentName}.ts`), templateData, 'utf-8')
        } else {
          fs.copyFileSync(path.resolve(sourceFolder, source), path.resolve(componentFolder, `${componentName}.${ext}`))
        }
      })
      console.log(`Add component ${componentName} success`)
    }).catch(e => console.error(e))
  },
}

// cli
const commands = new Set([
  'page',
  'component',
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
      $ node ./add.js <command>

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
