/**
 * 判断是否是质数
 * @param n
 * @returns
 */
export function isPrime(n: number) {
  if (n < 2) {
    return false
  }
  for (let i = 2; i <= n - 1; i++) {
    //有自身与1以外的因数
    if (n % i === 0) {
      return false
    }
  }
  return true
}
