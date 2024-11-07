console.log("css")
module.exports = function (sourceCode) {
  console.log(sourceCode)
  const res = `
    const style = document.createElement("style")
    style.innerHTML = \`${sourceCode}\`
    document.head.appendChild(style)
    module.exports = \`${sourceCode}\`
  `
  return res
}
