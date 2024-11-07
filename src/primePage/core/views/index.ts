import { EColor, getRandom } from "../../../primePage/utils/randomColor"
import { ICreateNumberRes, IViewer } from "../types"
import { NumberCreate } from ".."

export class PrimePageViewer implements IViewer {
  private _dom: HTMLElement
  private _centerDom: HTMLElement
  private _dataCore: NumberCreate

  constructor({ dom, center, dataCore }: { dom: HTMLElement; center: HTMLElement; dataCore: NumberCreate }) {
    this._dom = dom
    this._centerDom = center

    this._dataCore = dataCore
    this._dataCore.viewer = this
    this.registerEvents()
  }
  renderDom({ number, color, isPrime }: ICreateNumberRes<boolean>): void {
    const span = document.createElement("span")
    if (isPrime) {
      span.style.color = color
    }
    span.innerText = number + ""

    this._centerDom.innerText = number + ""
    this._dom.appendChild(span)
    isPrime && this.realizeTransition({ color, number })
  }
  private realizeTransition({ color, number }: { color: EColor; number: number }) {
    const div = document.createElement("div")
    div.style.color = color
    div.innerText = number + ""
    div.classList.add("center-cover")
    this._dom.appendChild(div)
    //reflow,重新布局
    getComputedStyle(div).left
    const randomx = getRandom(-50, 50)
    const randomy = getRandom(-50, 50)
    console.log({
      x: randomx,
      y: randomy,
    })

    div.style.transform = `translate(${-50 + randomx}%,${-50 + randomy}%)`
    div.style.opacity = 0 + ""
    setTimeout(() => {
      this._dom.removeChild(div)
    }, 2000)
  }
  private registerEvents() {
    window.onclick = () => {
      if (this._dataCore.isRunning) {
        this._dataCore.stop()
      } else {
        this._dataCore.start()
      }
    }
  }
}
