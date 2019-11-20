'use strict'
const path = require('path')
const { getAppObj } = require('../util')
const fs = require('fs')

// 获取指定目录下符合glob的所有文件
module.exports = function (file, whileList = []) {
  const entries = {}
  const srcDir = path.dirname(file)
  const matchPath = function (p) {
    const files = [path.resolve(srcDir, `${p}.js`), path.resolve(srcDir, `${p}.vue`)]
    return fs.existsSync(files[0]) && files[0] || fs.existsSync(files[1]) && files[1]
  }

  let mainObj = {}

  let pages

  let subpackages

  try {
    mainObj = getAppObj(file) || {}
    pages = mainObj.pages || []
    subpackages = mainObj.subpackages || mainObj.subPackages || []

    pages.forEach(p => {
      if (p.startsWith('^')) {
        p = p.replace(/^\^+/, '')
      }
      matchPath(p) && (entries[p] = matchPath(p))
    })
    subpackages.forEach(sp => {
      const { root, pages } = sp
      if (root && pages.length > 0) {
        pages.forEach(p => {
          if (p.startsWith('^')) {
            p = p.replace(/^\^+/, '')
          }
          matchPath(`${root}/${p}`) && (entries[`${root}/${p}`] = matchPath(`${root}/${p}`))
        })
      }
    })

    // 白名单筛选
    if (whileList.length > 0) {
      for (const p in entries) {
        whileList.indexOf(p) === -1 && (delete entries[p])
      }
    }
  } catch (e) {
    console.log(e)
  }

  return entries
}
