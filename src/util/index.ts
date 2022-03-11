// import { format, isSameDay } from 'date-fns'

/**
 * 保留指定的小数位（非四舍五入）
 * @param n 输入数字
 * @param fixed 小数位
 * @returns
 */
export const toFixed = (n: number, fixed: number) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed)

export const isNotEmptyArray = (arr: []) => Array.isArray(arr) && arr.length > 0

export const guid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// export const formatDate = (date: Date, fmt = 'yyyy-MM-dd HH:mm:ss'): string => {
//   if (!date)
//     return ''
//   return format(date, fmt)
// }

export const loadFile = async(path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.overrideMimeType('text/comma-separated-values;charset=utf-8')
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200)
        resolve(xhr.responseText)
      else
        reject(xhr.statusText)
    }
    xhr.onerror = () => {
      reject(Error('Network Error'))
    }
    xhr.send(null)
  })
}

export const getCountDays = (date: Date): number => {
  const newDate = new Date(date)
  const month = newDate.getMonth()
  newDate.setMonth(month + 1)
  newDate.setDate(0)
  return newDate.getDate()
}
