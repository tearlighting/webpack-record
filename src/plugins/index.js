// import { Compilation, Compiler } from "webpack"
// const { Compilation, Compiler } = require("webpack")

class MyFilePlugin {
  constructor({ filmeName = "fileList.txt" } = {}) {
    this.filmeName = filmeName
  }
  /**
   *
   * @param {Compiler} compiler
   */
  apply(compiler) {
    console.log("插件加载成功")
    compiler.hooks.emit.tap("MyFilePlugin", (compilation) => {
      const assets = Object.keys(compilation.assets)
      const res = assets
        .map((x) => {
          const size = compilation.assets[x].size()
          // return {
          // 	size,
          // 	name
          // }
          return `[${x}]:
    	  size:${size / 1000}kb
    	`
        })
        .join("\n\n")
      compilation.assets[this.filmeName] = {
        source() {
          return res
        },
        size() {
          return Buffer.from(res).byteLength
        },
      }
    })
  }
}

module.exports = MyFilePlugin
