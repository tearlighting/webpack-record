import { isPrime, getRandomColor } from "../utils"
import { ICreateNumberRes, IViewer } from "./types"

export class NumberCreate {
  private _createNumberTimer: number
  private _createDuration: number
  private _currentNumer = 1
  private _viewer: IViewer
  constructor({ duration = 500 }: { duration?: number } = {}) {
    this._createDuration = duration
  }
  start() {
    if (this._createNumberTimer) {
      return
    }
    this._createNumberTimer = setInterval(() => {
      this.createNumber()
    }, this._createDuration) as unknown as number
  }
  stop() {
    this._createNumberTimer && clearInterval(this._createNumberTimer)
    this._createNumberTimer = null
  }
  private createNumber() {
    // const primeNumber = this.generatePrime()
    const number = this._currentNumer++
    const prime = isPrime(number)
    const res: ICreateNumberRes<typeof prime> = {
      number,
      isPrime: prime,
      color: prime ? getRandomColor() : undefined,
    }
    this._viewer && this._viewer.renderDom(res)
  }

  set viewer(v: IViewer) {
    this._viewer = v
  }
  get isRunning() {
    return !!this._createNumberTimer
  }
  //   private generatePrime(): number {
  //     if (isPrime(this._currentNumer)) {
  //       return this._currentNumer
  //     }
  //     return this._currentNumer++ && this.generatePrime()
  //   }
}
