const path = require('path')
const fs = require('fs')

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

const Commands = {
  page(pageName) {
    if (!pageName) {
      throw new Error('Must give page name')
    }
    const pageFolder = path.resolve(base, 'src', 'pages', pageName)
    ensureFolder(pageFolder).then(() => {
      const sourceFolder = path.resolve(base, 'lib', 'templates', 'page')
      const sourceFiles = fs.readdirSync(sourceFolder)
      sourceFiles.forEach((source) => {
        const ext = source.split('.').pop()
        fs.copyFileSync(path.resolve(sourceFolder, source), path.resolve(pageFolder, `${pageName}.${ext}`))
      })
      console.log(`Add page ${pageName} success`)
    }).catch(e => console.error(e))
  },
  component(componentName) {
    if (!componentName) {
      throw new Error('Must give component name')
    }
    const componentFolder = path.resolve(base, 'src', 'components', componentName)
    ensureFolder(componentFolder).then(() => {
      const sourceFolder = path.resolve(base, 'lib', 'templates', 'component')
      const sourceFiles = fs.readdirSync(sourceFolder)
      sourceFiles.forEach((source) => {
        const ext = source.split('.').pop()
        fs.copyFileSync(path.resolve(sourceFolder, source), path.resolve(componentFolder, `${componentName}.${ext}`))
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
      $ add <command>

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
