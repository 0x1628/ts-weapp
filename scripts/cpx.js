// 直接使用 cpx 会偶发拷贝文件大小为 0 的情况，似乎与开发者工具有关
// 这里做一次矫正

const cpx = require('cpx')
const fs = require('fs')
const path = require('path')

const base = process.cwd()

const source = 'src/**/*.{wxml,wxs,png,jpg,json,svg,js}'
const outDir = 'dist'

const Commands = {
  copy() {
    cpx.copySync(source, outDir)
  },

  watch() {
    const evt = cpx.watch(source, outDir)

    evt.on('copy', (e) => {
      const dstPath = path.resolve(base, e.dstPath)
      const targetLen = fs.statSync(dstPath).size
      if (!targetLen) {
        // process.nextTick 无效
        setTimeout(() => {
          fs.writeFileSync(dstPath, fs.readFileSync(path.resolve(base, e.srcPath)))
        }, 10)
      }
    })

    evt.on('watch-ready', () => {
      console.log('cpx watching ready')
    })
  }
}

const commands = new Set([
  'copy',
  'watch'
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
      $ cpx <command>

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