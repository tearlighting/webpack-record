require("./style/index.css")

let src = require("./asset/bell.jpeg")
let img = document.createElement("img")
img.src = src
document.body.append(img)
src = require("./asset/bell.webp")
img = document.createElement("img")
img.src = src
document.body.append(img)
