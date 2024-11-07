export enum EColor {
  pink = "#f26395",
  green = "#62efab",
  orange = "#ef7658",
  yellow = "#ffe868",
  blue = "#80e3f7",
  purple = "#d781f9",
}

export type TColor = keyof typeof EColor
const colors = Object.keys(EColor) as TColor[]

/**
 * 向下取整可以取到最小值
 * @param min
 * @param max
 * @returns
 */
export function getRandom<T extends number>(min: T, max: T) {
  if (min > max) {
    throw new Error(`最小值不能大于最大值`)
  }
  return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomColor() {
  const index = getRandom(0, colors.length)
  const color = colors[index]
  return EColor[color]
}
