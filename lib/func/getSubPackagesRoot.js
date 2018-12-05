'use strict'
const { getAppObj } = require('../util')

// 获取指定目录下符合glob的所有文件
module.exports = function(file) {
    let entries = {},
        mainObj = {},
        subpackages

    try {
        mainObj = getAppObj(file) || {}
        subpackages = mainObj.subpackages || mainObj.subPackages || []
        subpackages.forEach(sp=>{
            let {root, pages} = sp
            if(root && pages.length>0){
                pages.forEach(p=>{
                    entries[`${root}/${p}`] = root
                })
            }
        })
        
    } catch (e) {
        console.log(e)
    }

    return entries
}