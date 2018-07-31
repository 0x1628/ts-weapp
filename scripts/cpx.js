// 直接使用 cpx 会偶发拷贝文件大小为 0 的情况，似乎与开发者工具有关
// 这里做一次矫正

const cpx = require('cpx')
const fs = require('fs')
const path = require('path')

const base = process.cwd()

const evt = cpx.watch('src/**/*.{wxml,wxs,png,jpg,json,svg,js}', 'dist')
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