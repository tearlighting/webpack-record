import { TColor, EColor } from "../utils/randomColor"

export interface ICreateNumberRes<TIsPrime extends boolean> {
  number: number
  isPrime: TIsPrime
  color: TIsPrime extends true ? EColor : never
}

export interface IViewer {
  renderDom(res: ICreateNumberRes<boolean>): void
}
