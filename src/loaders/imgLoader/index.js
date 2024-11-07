/// <reference path="index.d.ts" />
console.log("img")
/**
 *
 * @param {Buffer} source
 */
function imgLoader(source) {
  const loaderUtil = require("loader-utils")
  console.log(source, source.byteLength)

  /**
   * @type {IImgLoaderOPtions}
   */
  const options = loaderUtil.getOptions(this)
  const { limit = 10 } = options
  let res
  if (source.byteLength < limit) {
    res = getImgBase64(source)
  } else {
    res = getImgUrl.call(this, source)
  }
  return `module.exports = \`${res}\``
}
/**
 *
 * @param {Buffer} source
 */
function getImgBase64(source) {
  return `data:image/png;base64,` + source.toString("base64")
}
/**
 * @this {}
 * @param {Buffer} source
 */
function getImgUrl(source) {
  const loaderUtil = require("loader-utils")
  const filename = loaderUtil.interpolateName(this, "[contenthash:5].[ext]", {
    content: source,
  })
  //   console.log(filename, source)
  this.emitFile(filename, source)
  return filename
}

//设置使用buffer读取内容
imgLoader.raw = true

module.exports = imgLoader
