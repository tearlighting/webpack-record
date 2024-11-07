import { NumberCreate } from "./core"
import { PrimePageViewer } from "./core/views"

const dataCreater = new NumberCreate({ duration: 100 })

const dom = document.getElementById("container")
const center = document.querySelector("#center") as HTMLElement
new PrimePageViewer({
  dom,
  dataCore: dataCreater,
  center,
})
